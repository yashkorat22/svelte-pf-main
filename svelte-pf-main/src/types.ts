// types.ts 
//Add only when the type needs to be shared across multiple files.
export type Skill = {
    id: string;
    name: string;
    description: string;
    tags: string[];
    connectionType: string;
  };
  
 //Automation
export type Automation = {
    automationId: string;
    agentId: string;
    skillIds: string[];
    prompt: string;
    index: number;
    version: number;
    versionDate: string;
    versionBy: string;
  };
  
