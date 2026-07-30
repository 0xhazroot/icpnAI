'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Bot, 
  Link2, 
  LogOut, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'NotebookLM', href: '/notebook', icon: BookOpen },
    { name: 'JARVIS Tutor', href: '/jarvis', icon: Bot },
    { name: 'Conexiones', href: '/connections', icon: Link2 },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Sparkles size={20} color="#ffffff" />
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
            <div className={styles.userRole}>
              <GraduationCap size={12} />
              <span>ICPNA Student</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.navMenu}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Logout Button */}
      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
