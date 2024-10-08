const regexPcb = /^P\d+$/; // PCB
const regexTool = /^SA\d+$/; // 工装治具
const regexResult = /^(OK|NG)$/i; // OK NG  
  

export  const checkStringType=(str:string)=> {  
  if (regexPcb.test(str)) {  
    return 'pcb';  
  } else if (regexTool.test(str)) {  
    return 'tool';  
  } else if (regexResult.test(str)) {  
    return 'result';  
  } else {  
    return 'none';  
  }  
} 