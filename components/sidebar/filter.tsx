/**
 * Sorting and filtering buttons for the sidebar.
 *
 * All non-sidebar elements will be dimmed by a certain amount when a filter/sort is showing
 * options.
 *
 * Showing options will open a floating list bottom-aligned to the viewport near the filter
 * element. On desktop displays, this is an absolutely positioned list. On mobile displays, it
 * is a series of nested menu items.
 *
 * The hamburger menu of the sidebar condenses all of the content into a list on mobile aspect
 * ratios. Clicking on any item will dismiss the menu (always covers the size of the screen)
 * unless it goes into a sub-menu, which is what this is.
 *
 * TL;DR: Filter/sort is a submenu that covers the screen or a submenu that appears next to the
 * items.
 */
