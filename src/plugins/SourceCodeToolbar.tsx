import React from "react";
import SourceCodeCommand from "./SourceCodeCommand";
import { Code } from "@bedrock/icons-react";

// 这里可以从外面传一些配置进来，不过目前应该用不到
const createSourceCodeToolbar = (locales?: any)=>{
  const SelectToolbar = new SourceCodeCommand(
    <Code />,
    {
      tooltip: {
        zh: '源码噶',
        en: 'SourceCode',
      }
    }
  )
  return SelectToolbar

}

export default createSourceCodeToolbar;
