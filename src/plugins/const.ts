
import { PluginKey } from "@bedrock/editor"
export const sourceCodeKey = new PluginKey('SourceCode')

export type SourceCodeFileInfo = {
  src: string
  [key: string]: any
}
