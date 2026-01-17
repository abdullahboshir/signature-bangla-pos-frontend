// components/data-display/table-cells/PriceCell.tsx
interface PriceCellProps {
  price: number
  currency?: string
}

export function PriceCell({ price, currency = "USD" }: PriceCellProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price)

  return <span className="font-medium">{formatted}</span>
}
