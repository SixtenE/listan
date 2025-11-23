import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function Page() {
  return (
    <Card className="bg-background border-border hover:bg-card flex h-full items-center justify-center border-2 border-dashed transition">
      <Button variant="secondary" size="icon">
        <Plus className="text-muted-foreground" />
      </Button>
    </Card>
  )
}
