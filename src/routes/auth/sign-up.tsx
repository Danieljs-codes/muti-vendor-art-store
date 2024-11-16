import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout-id/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_auth-layout-id/sign-up!'
}
