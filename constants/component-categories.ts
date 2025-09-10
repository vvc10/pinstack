export const COMPONENT_CATEGORIES = [
  "Hero Sections",
  "Footers", 
  "Navigation / Menus",
  "Sidebars",
  "Headers",
  "Carousels / Sliders",
  "Cards",
  "Accordions",
  "Tabs",
  "Modals / Dialogs",
  "Dropdowns",
  "Tooltips / Popovers",
  "Forms (Login, Signup, Contact, Multi-step)",
  "Search Bars",
  "Tables / Data Grids",
  "Pagination",
  "Buttons (Primary, Secondary, Icon, Floating)",
  "Alerts / Toasts",
  "Badges / Tags / Chips"
] as const

export type ComponentCategory = typeof COMPONENT_CATEGORIES[number]
