export default async function Page({
  params,
}: {
  params: Promise<{ joinId: string }>
}) {
  const { joinId } = await params

  return <h1>{joinId}</h1>
}
