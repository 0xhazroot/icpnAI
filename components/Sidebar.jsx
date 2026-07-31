'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  Link2, 
  LogOut, 
  Sparkles, 
  Archive,
  GraduationCap
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on standalone Login / Splash page
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('google_classroom_token');
    }
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'NotebookLM', href: '/notebook', icon: BookOpen },
    { name: 'JARVIS Tutor', href: '/jarvis', icon: Bot },
    { name: 'Baúl Académico', href: '/vault', icon: Archive },
    { name: 'Conexiones', href: '/connections', icon: Link2 },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Sparkles size={18} color="#ffffff" />
        </div>
        <span className={styles.brandTitle}>icpnAI</span>
      </div>

      {/* User Greeting Card */}
      <div className={styles.userCard}>
        <span className={styles.greeting}>Good Morning!</span>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>SH</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>Samir Haziel</span>
            <span className={styles.userRole}>
              <GraduationCap size={12} />
              ICPNA Student
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={styles.navMenu}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Logout Action */}
      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
