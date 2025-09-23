"use client"

import { useState, ReactNode } from "react"
import { BoardsSidebar, SidebarProvider, useSidebar } from "@/components/board/boards-sidebar"
import { Header } from "./header"
import { useNoticeBanner } from "@/contexts/notice-banner-context"

interface AppLayoutProps {
  children: ReactNode
  currentTab?: string
  sort?: "trending" | "most-voted" | "newest"
  onSortChange?: (v: "trending" | "most-voted" | "newest") => void
}

function AppLayoutContent({ children, currentTab = "home", sort, onSortChange }: AppLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { isCollapsed } = useSidebar()
  const { isVisible: isNoticeBannerVisible } = useNoticeBanner()

  return (
    <main className="min-h-dvh flex flex-col overflow-x-hidden transition-all duration-300 ease-in-out">
      <Header 
        onMobileSidebarToggle={() => setIsMobileSidebarOpen(true)} 
        sort={sort}
        onSortChange={onSortChange}
      />
      
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-full">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Desktop Sidebar - Fixed */}
          <div className="hidden md:block">
            <BoardsSidebar currentTab={currentTab} />
          </div>
          
          {/* Mobile Sidebar */}
          <BoardsSidebar 
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            currentTab={currentTab}
          />
          
          {/* Main Content with Dynamic Sidebar Offset */}
          <div className={`transition-all duration-300 ease-in-out ${
            isCollapsed ? 'md:ml-16' : 'md:ml-64'
          }`}>
            <div 
              className="transition-all duration-300 ease-in-out"
              style={{
                paddingTop: isNoticeBannerVisible ? '6rem' : '3rem'
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function AppLayout({ children, currentTab, sort, onSortChange }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent currentTab={currentTab} sort={sort} onSortChange={onSortChange}>
        {children}
      </AppLayoutContent>
    </SidebarProvider>
  )
}
