import { AnyRouter, TRPCError, initTRPC } from "@trpc/server";
import { getAppSessionServer } from "../next-auth/server";
import { SharedSession } from "@/kernel/domain/user";
import { ZodTypeAny, z } from "zod";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { injectable } from "inversify";

@injectable()
export abstract class Controller {
  abstract router: AnyRouter;
}

export const createContext = async () => {
  const session = await getAppSessionServer();

  return {
    session,
  };
};

export const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authorizedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const checkAbilityProcedure = <Ability>({
  check,
  create,
}: {
  check?: (ability: Ability) => boolean;
  create: (session: SharedSession) => Ability;
}) =>
  authorizedProcedure.use(({ ctx, next }) => {
    const ability = create(ctx.session);

    if (check && !check(ability)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx: {
        session: ctx.session,
        ability,
      },
    });
  });

export const checkAbilityInputProcedure = <Ability, Input extends ZodTypeAny>({
  check,
  create,
  input,
}: {
  input: Input;
  check: (ability: Ability, input: z.infer<Input>) => boolean;
  create: (session: SharedSession) => Ability;
}) =>
  authorizedProcedure.input(input).use(({ ctx, next, input: params }) => {
    const ability = create(ctx.session);

    if (!check(ability, params)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx: {
        session: ctx.session,
        ability,
      },
    });
  });

export const sharedRouter = router({});
export type SharedRouter = typeof sharedRouter;

export const createPublicServerApi = <T extends AnyRouter>(router: T) =>
  createServerSideHelpers<T>({
    router: router,
    ctx: () => ({}),
  } as any); // The signature is correct, the type problem is due to a peculiarity of tRPC typing.
