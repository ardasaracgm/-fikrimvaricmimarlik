import {type SchemaTypeDefinition} from 'sanity'
import {projectType} from './project'
import {fitoutPageType} from './fitoutPage'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [projectType, fitoutPageType],
}
