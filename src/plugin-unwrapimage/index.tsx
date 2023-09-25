import * as React from 'react';
import { RockEditorPlugin, PluginKey } from '@bedrock/editor';

// 这里只处理 img标签被单独嵌套的情况
// 比如 div>p>img， 这样会把img提到body下
// 如果 img和其他文本在一起，会提取到该文本父节点的后面，可能会有些小怪，即  p>(一些文字 + img + 一些文字)  => p>(一些文字 + 一些文字) + img
// 但是如果把 dom暴力裁剪开，p>(一些文字 + img + 一些文字)  =>  p>一些文字 + img + p>一些文字， 在多层嵌套的场景下可能会有问题，所以这种情况在这里未处理，业务可以参考自身的情况处理
const unWrapImgNode = (node: Node)=>{
  if (node && node.nodeType === 1) {
    if(node.nodeName === 'IMG' && node.parentNode?.nodeName !== 'BODY' && !node.parentElement?.matches('.figure.image')){
      let curParent = node.parentNode
      let root = curParent!.parentNode
      // ARTICLE兼容灵犀
      while(root && !['BODY','TD','FIGURE', 'ARTICLE'].includes(root.nodeName)) {
        curParent = root!
        root = curParent!.parentNode
      }
      root?.insertBefore(node, curParent!.nextSibling)
      // 只包含图片，图片提取后变成空节点需要删掉
      if(curParent?.textContent?.trim() === ''){
        root?.removeChild(curParent!)
      }
    }
  }
  node.childNodes.forEach((childNode) => {
    unWrapImgNode(childNode);
  });
}

function createUnwrapImagePlugin() {
  return new RockEditorPlugin({
    key: new PluginKey('unWrapImage'),
    patchNormalizeHTML(doc, config, options) {
      if(!options.isPaste){
        // 这里只处理非粘贴的情况，即回显的情况
        unWrapImgNode(doc)
      }
    }
  });
}

export default createUnwrapImagePlugin;
