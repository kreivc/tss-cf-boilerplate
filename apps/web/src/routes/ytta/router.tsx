import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ytta/router')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_ytta/router"!</div>
}
