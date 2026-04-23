import { Agent } from '@strands-agents/sdk'
import { AgentSkills, Skill } from '@strands-agents/sdk/vended-plugins/skills'
import { bash } from '@strands-agents/sdk/vended-tools/bash'
import { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'

const model = null as any

// =====================
// Usage Example
// =====================

{
  // --8<-- [start:usage]

  // Single skill directory
  const singlePlugin = new AgentSkills({
    skills: ['./skills/pdf-processing'],
  })

  // Parent directory — loads all child directories
  // containing SKILL.md
  const dirPlugin = new AgentSkills({
    skills: ['./skills/'],
  })

  // Mixed sources
  const plugin = new AgentSkills({
    skills: [
      './skills/pdf-processing', // Single skill dir
      './skills/', // Parent directory
      new Skill({
        // Programmatic skill
        name: 'custom-greeting',
        description: 'Generate custom greetings',
        instructions: 'Always greet the user by name with enthusiasm.',
      }),
    ],
  })

  const agent = new Agent({
    model,
    plugins: [plugin],
  })

  // --8<-- [end:usage]
  void singlePlugin
  void dirPlugin
  void agent
}

// =====================
// Providing Tools for Resource Access
// =====================

{
  // --8<-- [start:tools]

  const plugin = new AgentSkills({
    skills: ['./skills/'],
  })

  const agent = new Agent({
    model,
    plugins: [plugin],
    tools: [bash, fileEditor],
  })

  // --8<-- [end:tools]
  void agent
}

// =====================
// Programmatic Skill Creation
// =====================

{
  // --8<-- [start:programmatic]

  // Create directly
  const skill = new Skill({
    name: 'code-review',
    description: 'Review code for best practices and bugs',
    instructions: 'Review the provided code. Check for...',
  })

  // Parse from SKILL.md content
  const fromContent = Skill.fromContent(
    [
      '---',
      'name: code-review',
      'description: Review code for best practices and bugs',
      '---',
      'Review the provided code. Check for...',
    ].join('\n')
  )

  // Load from a specific directory
  const fromFile = Skill.fromFile('./skills/code-review')

  // Load all skills from a parent directory
  const skills = Skill.fromDirectory('./skills/')

  // --8<-- [end:programmatic]
  void skill
  void fromContent
  void fromFile
  void skills
}

// =====================
// Managing Skills at Runtime
// =====================

{
  // --8<-- [start:runtime]

  const plugin = new AgentSkills({
    skills: ['./skills/pdf-processing'],
  })
  const agent = new Agent({ model, plugins: [plugin] })

  // View available skills
  const available = await plugin.getAvailableSkills()
  for (const skill of available) {
    console.log(`${skill.name}: ${skill.description}`)
  }

  // Add a new skill at runtime
  const newSkill = new Skill({
    name: 'summarize',
    description: 'Summarize long documents',
    instructions: 'Read the document and produce a concise summary...',
  })
  plugin.setAvailableSkills([...available, newSkill])

  // Replace all skills
  plugin.setAvailableSkills(['./skills/new-set/'])

  // Check which skills the agent has activated
  const activated = plugin.getActivatedSkills(agent)
  console.log(`Activated skills: ${activated}`)

  // --8<-- [end:runtime]
}
