import systemAuthRouter from './system_auth'
import systemOpaRouter from './system_opa'

export default [
  ...systemAuthRouter,
  ...systemOpaRouter
]