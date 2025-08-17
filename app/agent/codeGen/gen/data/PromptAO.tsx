import dedent from 'dedent';
import { LUA_COOKBOOK, LUA_COOKBOOK_USAGE_EXAMPLES } from './aodata';

export default {
  CHAT_PROMPT: dedent`
    🛠️ You're building a production-ready Arweave dApp with React. Core features:
    1. Secure wallet auth using provided connection flows
    2. AR data operations (store/retrieve/query)
    3. Real-time balance tracking with elegant animations
    4. Transaction history with GraphQL
    5. Process management (spawn/message)
    
    Response Guidelines:
    - Acknowledge using provided auth/AR functions
    - Explain architecture decisions
    - Highlight security measures
    - Keep under 15 lines
    - Include smooth animations and transitions
    - give a handlers.lua file containing code for arweave handlers 
    `,

 
};

    