import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// Restore ONLY LayoutDashboard for testing
// import { 
//   Menu, 
//   X, 
//   ChevronDown, 
//   ChevronRight, 
// } from 'lucide-react'; 
import { LayoutDashboard } from 'lucide-react'; 
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Users } from 'lucide-react';
import { Clock } from 'lucide-react'; 
import { DollarSign } from 'lucide-react'; 
import { Calculator } from 'lucide-react'; 
import { Building } from 'lucide-react';
import { BarChart3 } from 'lucide-react'; 
// import { ClipboardUser } from 'lucide-react'; 
// } from 'lucide-react';

import { useAuth } from '@/useAuth';
import { useData } from '@/DataContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { factories } = useData() || { factories: [] };
  
  const [isMobile, setIsMobile] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(true);
  
  // Detect mobile screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [setCollapsed]);
  
  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };
  
  // Toggle organization submenu
  const toggleOrganization = () => {
    setOrganizationOpen(!organizationOpen);
  };
  
  // Navigation items - Restore ONLY Dashboard icon
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      active: pathname === '/dashboard'
    },
    {
      name: 'Organization',
      href: '/dashboard/organization',
      icon: <Users size={20} />,
      active: pathname.includes('/dashboard/organization') || pathname.includes('/dashboard/factory'),
      submenu: [
        {
          name: 'Foundation',
          href: '/dashboard/organization',
          active: pathname === '/dashboard/organization'
        },
        // Restore factory mapping
        ...(factories || []).map(factory => ({
          name: factory.name,
          href: `/dashboard/factory/${factory.id}`,
          active: pathname === `/dashboard/factory/${factory.id}`
        }))
      ]
    },
    {
      name: 'Personnel',
      href: '/dashboard/personnel',
      icon: <Users size={20} />,
      active: pathname === '/dashboard/personnel'
    },
    {
      name: 'Factories',
      href: '/dashboard/factories',
      icon: <Building size={20} />,
      active: pathname.includes('/dashboard/factories'),
      submenu: [
        { name: 'Overview', href: '/dashboard/factories', active: pathname === '/dashboard/factories' },
        { name: 'Compare', href: '/dashboard/factories/compare', active: pathname === '/dashboard/factories/compare' }
      ]
    },
    {
      name: 'Timeline',
      href: '/dashboard/timeline',
      icon: <Clock size={20} />,
      active: pathname === '/dashboard/timeline'
    },
    {
      name: 'Budget',
      href: '/dashboard/budget',
      icon: <DollarSign size={20} />,
      active: pathname === '/dashboard/budget'
    },
    {
      name: 'Resources',
      href: '/dashboard/resources',
      icon: <Calculator size={20} />,
      active: pathname === '/dashboard/resources'
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: <BarChart3 size={20} />,
      active: pathname === '/dashboard/reports'
    }
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'z-30' : 'z-10'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header - Icons commented out */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-[#004B87] rounded-md flex items-center justify-center text-white font-bold">
                PCI
              </div>
              {!collapsed && (
                <span className="ml-2 text-lg font-semibold text-[#004B87]">Quality Org</span>
              )}
            </div>
            <button 
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004B87]"
              onClick={() => setCollapsed(!collapsed)}
            >
              {/* Restore X and ChevronRight */} 
              {collapsed ? <ChevronRight size={20} /> : <X size={20} />}
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div>
                      <button
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          item.active 
                            ? 'text-[#004B87] bg-[#E6EEF4]' 
                            : 'text-gray-700 hover:text-[#004B87] hover:bg-gray-100'
                        }`}
                        onClick={item.name === 'Organization' ? toggleOrganization : undefined}
                      >
                        {/* Restore Icon span for submenu items */}
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-3">{item.icon}</span> 
                        {!collapsed && (
                          <>
                            {/* <span className="flex-1 text-left ml-3">{item.name}</span> */} {/* Remove margin if icon present */}
                            <span className="flex-1 text-left">{item.name}</span> 
                             {/* Restore ChevronDown */}
                             <ChevronDown 
                               size={16} 
                               className={`transform transition-transform duration-200 ${
                                 // Keep logic for Organization, assume Factories submenu always shown when expanded
                                 (item.name === 'Organization' && organizationOpen) || (item.name === 'Factories') ? 'rotate-180' : '' 
                               }`} 
                             /> 
                          </>
                        )}
                      </button>
                      
                      {!collapsed && (item.name === 'Organization' ? organizationOpen : item.name === 'Factories' ? true : false) && (
                        <ul className="mt-1 pl-10 space-y-1">
                          {(item.submenu || []).map((subitem, subindex) => (
                            <li key={subindex}>
                              <Link
                                href={subitem.href}
                                className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                  subitem.active 
                                    ? 'text-[#004B87] bg-[#E6EEF4] font-medium' 
                                    : 'text-gray-600 hover:text-[#004B87] hover:bg-gray-100'
                                }`}
                                onClick={handleLinkClick}
                              >
                                {subitem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        item.active 
                          ? 'text-[#004B87] bg-[#E6EEF4]' 
                          : 'text-gray-700 hover:text-[#004B87] hover:bg-gray-100'
                      }`}
                      onClick={handleLinkClick}
                    >
                      {/* Restore Icon span for non-submenu items */}
                       <span className="inline-flex items-center justify-center w-6 h-6 mr-3">{item.icon}</span> 
                      {/* {!collapsed && <span className="ml-3">{item.name}</span>} */}
                      {/* Use conditional rendering based on if icon exists for this item */} 
                      {!collapsed && <span className={item.icon ? '' : 'ml-3'}>{item.name}</span>} 
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            {!collapsed && (
              <div className="text-xs text-gray-500">
                <p>PCI Quality Organization</p>
                <p>Version 1.0.0</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Mobile Toggle Button - Icons commented out */}
      {isMobile && (
        <button 
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-md md:hidden"
          onClick={() => setCollapsed(false)}
        >
           {/* Restore Menu icon */}
           <Menu size={24} /> 
        </button>
      )}
    </>
  );
}
