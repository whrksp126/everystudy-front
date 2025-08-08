import { IconFolder67CDFF, IconFolder717171, IconFolder1C82F6, IconFolder59D878, IconFolderFFDC4B, IconFolderFF625A, IconFolder7568F1 } from "../assets/Icon.tsx";  


export function getFolderSvg({width, height, color}: {width: string, height: string, color: string}) {
  switch (color) {
    case '#67cdff':
      return <IconFolder67CDFF width={width} height={height} />
    case '#717171':
      return <IconFolder717171 width={width} height={height} />
    case '#1C82F6':
      return <IconFolder1C82F6 width={width} height={height} />
    case '#59D878':
      return <IconFolder59D878 width={width} height={height} />
    case '#FFDC4B':
      return <IconFolderFFDC4B width={width} height={height} />
    case '#FF625A':
      return <IconFolderFF625A width={width} height={height} />
    case '#7568F1':
      return <IconFolder7568F1 width={width} height={height} />
    default:
      return <IconFolder67CDFF width={width} height={height} />
  }
};
