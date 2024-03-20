/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Cuid = string;

export interface Lesson {
  id: Cuid;
  title: string;
  shortDescription?: string;
  blocks: (TextBlock | VideoBlock | QuestionBlock)[];
}
export interface TextBlock {
  id: Cuid;
  type: "text";
  text: string;
}
export interface VideoBlock {
  id: Cuid;
  type: "video";
  url: string;
}
export interface QuestionBlock {
  id: Cuid;
  type: "question";
  answerOptions: AnswerOption[];
  explanation?: string;
  successMessage?: string;
  text?: string;
}
export interface AnswerOption {
  id: Cuid;
  text: string;
  isRight: boolean;
}
