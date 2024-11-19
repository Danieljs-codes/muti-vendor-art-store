import { createFileRoute } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'



export const Route = createFileRoute(
  '/_dashboard-layout-id/dashboard/artworks',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_dashboard-layout-id/dashboard/artworks!'
}
