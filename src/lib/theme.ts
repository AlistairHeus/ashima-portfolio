import { PROJECT_THEMES, type ProjectThemeKey } from '../constants/theme';

/**
 * Returns label and surface colors for a featured project theme key.
 */
export const getProjectTheme = (themeKey: ProjectThemeKey) => PROJECT_THEMES[themeKey];
