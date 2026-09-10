import React, { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import {
  Home,
  Mail,
  MessageSquare,
  Folder,
  Calendar,
  CheckSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  Palette,
  LogOut,
  X,
  Command,
  ChevronRight,
} from 'lucide-react-native'
import { useAuthStore } from '../../stores/auth-store'
import { useAuth } from '../../providers/auth-provider'
import { useTheme } from '../../providers/theme-provider'
import { useNotificationStore } from '../../stores/notification-store'

interface AppSidebarProps {
  isMobile?: boolean
  onNavigate?: () => void
}

export function AppSidebar({
  isMobile = false,
  onNavigate,
}: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { auth } = useAuthStore()
  const authContext = useAuth()
  const { openThemeDrawer, colors, resolvedMode } = useTheme()
  const { unreadCount } = useNotificationStore()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const activeUser = authContext?.user || auth.user
  const userMetadata = authContext?.user?.user_metadata

  const userName =
    userMetadata?.full_name ||
    userMetadata?.name ||
    userMetadata?.user_name ||
    auth.user?.name ||
    activeUser?.email?.split('@')[0] ||
    'User'

  const userEmail =
    activeUser?.email ||
    auth.user?.email ||
    ''

  const userInitials =
    userName
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || (userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U')

  const navMenuItems = [
    {
      title: 'Home',
      shortTitle: 'Home',
      url: '/(app)',
      icon: Home,
      comingSoon: false,
      match: (p: string) => p === '/' || p === '/(app)' || p === '/(app)/index',
    },
    {
      title: 'Email',
      shortTitle: 'Email',
      url: '/message',
      icon: Mail,
      comingSoon: true,
      match: (p: string) => p === '/message' || p === '/email-settings',
    },
    {
      title: 'Chat',
      shortTitle: 'Chat',
      url: '/chattemplate',
      icon: MessageSquare,
      comingSoon: true,
      match: (p: string) =>
        p === '/chattemplate' ||
        p === '/ai-chat' ||
        p === '/ai_chat' ||
        p === '/ai-search',
    },
    {
      title: 'Files',
      shortTitle: 'Files',
      url: '/files',
      icon: Folder,
      comingSoon: true,
      match: (p: string) => p === '/files',
    },
    {
      title: 'Calendar',
      shortTitle: 'Calendar',
      url: '/calendar',
      icon: Calendar,
      comingSoon: true,
      match: (p: string) => p === '/calendar',
    },
    {
      title: 'Tasks',
      shortTitle: 'Tasks',
      url: '/todos',
      icon: CheckSquare,
      comingSoon: true,
      match: (p: string) => p === '/todos' || p === '/tasks',
    },
    {
      title: 'Notification',
      shortTitle: 'Notification',
      url: '/notifications',
      icon: Bell,
      comingSoon: true,
      match: (p: string) =>
        p === '/notifications' ||
        p === '/notification' ||
        p === '/notice',
    },
  ]

  const handlePress = (url: string) => {
    router.push(url as any)
    if (onNavigate) onNavigate()
  }

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    try {
      if (authContext?.signOut) {
        await authContext.signOut()
      }
    } catch {}
    useAuthStore.getState().auth.reset()
    router.replace('/(auth)/sign-in' as any)
    if (onNavigate) onNavigate()
  }

  // ─────────────────────────────────────────────────────────────
  // MOBILE DRAWER LAYOUT
  // ─────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <View
        style={[
          styles.mobileDrawerContainer,
          {
            backgroundColor: colors.sidebar || colors.background,
          },
        ]}
      >
        {/* Drawer Header: Brand info on left + Cross icon on right */}
        <View style={styles.mobileDrawerHeader}>
          <Pressable
            onPress={onNavigate}
            style={styles.mobileBrandRow}
            hitSlop={6}
            accessibilityRole='button'
            accessibilityLabel='Close Drawer'
          >
            <View style={[styles.appLogoBox, { backgroundColor: colors.primary }]}>
              <Command
                size={18}
                color={colors.primaryForeground || '#ffffff'}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.mobileBrandTextBox}>
              <Text
                style={[styles.mobileAppName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                Amoga App
              </Text>
              <Text
                style={[styles.mobileAppSub, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                Workspace
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={onNavigate}
            style={({ pressed }) => [
              styles.mobileCloseButton,
              pressed && { backgroundColor: colors.secondary, opacity: 0.8 },
            ]}
            hitSlop={8}
            accessibilityRole='button'
            accessibilityLabel='Close Drawer'
          >
            <X size={18} color={colors.mutedForeground} strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Mobile Navigation List */}
        <ScrollView
          style={styles.mobileNavScroll}
          contentContainerStyle={styles.mobileNavContent}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[styles.mobileSectionTitle, { color: colors.mutedForeground }]}
          >
            MENU
          </Text>

          {navMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.match(pathname)

            return (
              <Pressable
                key={item.title}
                onPress={() => handlePress(item.url)}
                style={({ pressed }) => [
                  styles.mobileNavItem,
                  pressed && { opacity: 0.8 },
                ]}
                accessibilityRole='button'
                accessibilityState={{ selected: isActive }}
              >
                <View
                  style={[
                    styles.mobileNavIconWrap,
                    isActive && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Icon
                    size={18}
                    color={
                      isActive
                        ? colors.primaryForeground || '#ffffff'
                        : colors.mutedForeground
                    }
                    strokeWidth={2}
                  />
                  {item.icon === Bell && unreadCount > 0 && (
                    <View
                      style={[
                        styles.railBadgeDot,
                        { backgroundColor: colors.destructive || '#ef4444' },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.mobileNavItemText,
                    {
                      color: isActive
                        ? colors.primary || colors.foreground
                        : colors.foreground,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {isActive && (
                  <View
                    style={[
                      styles.activeIndicatorDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Mobile User Profile Footer */}
        <View
          style={[
            styles.mobileFooter,
            { borderTopColor: 'transparent' },
          ]}
        >
          <Pressable
            onPress={() => setIsUserMenuOpen(true)}
            style={({ pressed }) => [
              styles.mobileUserCard,
              pressed && { backgroundColor: colors.secondary },
            ]}
          >
            <View
              style={[
                styles.mobileAvatar,
                {
                  backgroundColor: colors.secondary,
                },
              ]}
            >
              <Text
                style={[styles.mobileAvatarText, { color: colors.foreground }]}
              >
                {userInitials}
              </Text>
            </View>
            <View style={styles.mobileUserInfo}>
              <Text
                style={[styles.mobileUserName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {userName}
              </Text>
              <Text
                style={[
                  styles.mobileUserEmail,
                  { color: colors.mutedForeground },
                ]}
                numberOfLines={1}
              >
                {userEmail || 'My Account'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* USER DROPDOWN MODAL */}
        {renderUserDropdownModal()}
      </View>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // DESKTOP RAIL LAYOUT (Screenshot Style)
  // ─────────────────────────────────────────────────────────────
  return (
    <View
      style={[
        styles.railContainer,
        {
          backgroundColor: colors.sidebar || colors.background,
        },
      ]}
    >
      {/* Top: App Logo */}
      <View style={styles.railHeader}>
        <Pressable
          onPress={() => handlePress('/(app)')}
          style={({ pressed }) => [
            styles.railLogoBox,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Amoga Home'
          hitSlop={6}
        >
          <Command
            size={20}
            color={colors.primaryForeground || '#ffffff'}
            strokeWidth={2.4}
          />
        </Pressable>
      </View>

      {/* Center Nav Items */}
      <ScrollView
        style={styles.railScroll}
        contentContainerStyle={styles.railNavContent}
        showsVerticalScrollIndicator={false}
      >
        {navMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.match(pathname)

          return (
            <Pressable
              key={item.title}
              onPress={() => handlePress(item.url)}
              style={({ pressed }) => [
                styles.railNavItem,
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
              ]}
              accessibilityRole='button'
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.title}
            >
              <View
                style={[
                  styles.railIconWrap,
                  isActive && {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Icon
                  size={20}
                  color={
                    isActive
                      ? colors.primaryForeground || '#ffffff'
                      : colors.mutedForeground
                  }
                  strokeWidth={2}
                />
                {item.icon === Bell && unreadCount > 0 && (
                  <View
                    style={[
                      styles.railBadgeDot,
                      { backgroundColor: colors.destructive || '#ef4444' },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.railNavLabel,
                  {
                    color: isActive
                      ? colors.primary || colors.foreground
                      : colors.mutedForeground,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {item.shortTitle}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Bottom Actions: Profile */}
      <View
        style={[
          styles.railFooter,
        ]}
      >
        {/* Profile Menu Trigger */}
        <Pressable
          onPress={() => setIsUserMenuOpen(true)}
          style={({ pressed }) => [
            styles.railNavItem,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Profile Menu'
        >
          <View
            style={[
              styles.railAvatar,
              {
                backgroundColor: colors.secondary,
              },
            ]}
          >
            <Text
              style={[styles.railAvatarText, { color: colors.foreground }]}
            >
              {userInitials}
            </Text>
          </View>
          <Text
            style={[styles.railNavLabel, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            Profile
          </Text>
        </Pressable>
      </View>

      {/* USER DROPDOWN MODAL */}
      {renderUserDropdownModal()}
    </View>
  )

  // ─────────────────────────────────────────────────────────────
  // REUSABLE USER DROPDOWN MODAL
  // ─────────────────────────────────────────────────────────────
  function renderUserDropdownModal() {
    return (
      <Modal
        visible={isUserMenuOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setIsUserMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsUserMenuOpen(false)}
        >
          <Pressable
            style={[
              styles.dropdownCard,
              {
                backgroundColor: colors.card || colors.background,
                borderColor: colors.border,
                left: isMobile ? 16 : 80,
                bottom: 24,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header: Avatar + Name + Email */}
            <View style={styles.dropdownHeader}>
              <View
                style={[
                  styles.dropdownAvatar,
                  {
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dropdownAvatarText,
                    { color: colors.foreground },
                  ]}
                >
                  {userInitials}
                </Text>
              </View>
              <View style={styles.dropdownUserInfo}>
                <Text
                  style={[
                    styles.dropdownUserName,
                    { color: colors.foreground },
                  ]}
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={[
                    styles.dropdownUserEmail,
                    { color: colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {userEmail || 'Account'}
                </Text>
              </View>
            </View>

            <View
              style={[styles.menuDivider, { backgroundColor: colors.border }]}
            />

            {/* Menu Options */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/app-settings' as any)
                if (onNavigate) onNavigate()
              }}
            >
              <User size={16} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                My Profile
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                openThemeDrawer()
                if (onNavigate) onNavigate()
              }}
            >
              <Palette size={16} color={colors.primary} />
              <Text
                style={[
                  styles.menuItemText,
                  { color: colors.foreground, fontWeight: '600' },
                ]}
              >
                Theme Settings
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/app-settings' as any)
                if (onNavigate) onNavigate()
              }}
            >
              <Settings size={16} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Settings
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                setIsUserMenuOpen(false)
                router.push('/notifications' as any)
                if (onNavigate) onNavigate()
              }}
            >
              <Bell size={16} color={colors.mutedForeground} />
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>
                Notifications
              </Text>
            </Pressable>

            <View
              style={[styles.menuDivider, { backgroundColor: colors.border }]}
            />

            {/* Sign Out */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondary },
              ]}
              onPress={handleSignOut}
            >
              <LogOut size={16} color='#ef4444' strokeWidth={2} />
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  // ─── Desktop Rail Styles ─────────────────────────────────
  railContainer: {
    width: 76,
    height: '100%',
    borderRightWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 14,
    zIndex: 20,
  },
  railHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  railLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  railScroll: {
    flex: 1,
    width: '100%',
  },
  railNavContent: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  railNavItem: {
    width: 60,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  railIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  railNavLabel: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: -0.2,
  },
  railBadgeDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  railFooter: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 0,
    gap: 14,
  },
  railAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },

  // ─── Mobile Drawer Styles ─────────────────────────────────
  mobileDrawerContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    borderRightWidth: 0,
  },
  mobileDrawerHeader: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  mobileBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  mobileBrandTextBox: {
    flex: 1,
  },
  mobileCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileAppName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  mobileAppSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  mobileNavScroll: {
    flex: 1,
  },
  mobileNavContent: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 2,
  },
  mobileSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  mobileNavIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileNavItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  activeIndicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  mobileBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  mobileFooter: {
    padding: 8,
    borderTopWidth: 0,
  },
  mobileUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    gap: 8,
  },
  mobileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  mobileUserInfo: {
    flex: 1,
  },
  mobileUserName: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  mobileUserEmail: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },

  // ─── Modal & Dropdown Styles ───────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dropdownCard: {
    position: 'absolute',
    width: 240,
    borderRadius: 14,
    borderWidth: 0,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
  },
  dropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  dropdownUserInfo: {
    flex: 1,
  },
  dropdownUserName: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  dropdownUserEmail: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  menuDivider: {
    height: 1,
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
  },
  menuItemText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  signOutText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    color: '#ef4444',
    fontWeight: '600',
  },
})
