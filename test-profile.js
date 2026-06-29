const { z } = require('zod');
const profileSchema = z.object({
  interest: z.array(z.string()).optional()
});
console.log(profileSchema.parse({ interest: ["football"] }));
console.log(profileSchema.parse({ interest: [] }));
