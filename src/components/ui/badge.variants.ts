import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Add priority-specific variants
        "priority-high": "border-transparent bg-red-500 text-white hover:bg-red-600",
        "priority-medium": "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        "priority-low": "border-transparent bg-green-500 text-white hover:bg-green-600",
        // Add status-specific variants
        "status-todo": "border-transparent bg-gray-500 text-white hover:bg-gray-600",
        "status-in-progress": "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        "status-done": "border-transparent bg-green-500 text-white hover:bg-green-600",
        // Add sprint status variants
        "sprint-planning": "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        "sprint-active": "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        "sprint-completed": "border-transparent bg-green-500 text-white hover:bg-green-600",
        // Add epic status variants
        "epic-active": "border-transparent bg-indigo-500 text-white hover:bg-indigo-600",
        "epic-completed": "border-transparent bg-teal-500 text-white hover:bg-teal-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)