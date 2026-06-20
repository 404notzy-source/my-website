## Purpose

主题系统提供亮色/暗色双模式切换能力，通过 React Context 管理状态，配合 Tailwind CSS `dark:` 变体和 CSS 自定义属性实现全站主题切换，默认暗色模式。

## Requirements

### Requirement: 主题状态管理

系统 SHALL 提供 React Context 管理亮色/暗色主题状态，并提供切换方法。

#### Scenario: 默认主题

- **GIVEN** 用户首次访问网站，无已存储的主题偏好
- **WHEN** 页面加载完成
- **THEN** 主题默认为暗色模式

#### Scenario: 从暗色切换到亮色

- **GIVEN** 当前主题为暗色模式（默认）
- **WHEN** 用户触发主题切换
- **THEN** `<html>` 元素的 `dark` class 被移除
- **THEN** 页面所有使用 Tailwind `dark:` 前缀的元素切换为亮色样式

#### Scenario: 从亮色切换回暗色

- **GIVEN** 当前主题为亮色模式
- **WHEN** 用户触发主题切换
- **THEN** `<html>` 元素添加 `dark` class
- **THEN** 页面恢复暗色样式

#### Scenario: 主题切换不导致页面闪烁

- **GIVEN** 用户在任意页面
- **WHEN** 用户切换主题
- **THEN** 页面样式平滑过渡，无明显闪烁或布局跳动

#### Scenario: Context 未包裹时的边界处理（边界场景）

- **GIVEN** 某组件在 `ThemeProvider` 外部被渲染
- **WHEN** 该组件调用 `useTheme()` hook
- **THEN** 系统抛出明确的错误信息：`useTheme must be used within a ThemeProvider`

### Requirement: CSS 自定义属性驱动的主题色值

系统 SHALL 使用 CSS 自定义属性（`--hero-gradient-*`）定义 Hero 渐变的两套色值，通过 `.dark` class 自动切换，无需 JS 干预。

#### Scenario: 亮色模式下的 CSS 变量值

- **GIVEN** `<html>` 元素无 `dark` class
- **WHEN** Hero 组件渲染
- **THEN** `--hero-gradient-from` 为亮色起始色值
- **THEN** `--hero-gradient-to` 为亮色终止色值

#### Scenario: 暗色模式下的 CSS 变量值

- **GIVEN** `<html>` 元素有 `dark` class
- **WHEN** Hero 组件渲染
- **THEN** `--hero-gradient-from` 为暗色起始色值
- **THEN** `--hero-gradient-to` 为暗色终止色值
