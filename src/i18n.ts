// i18n：中英双语，类型安全字典
// - LangSetting: auto（跟随 Obsidian 界面语言）/ zh / en
// - 新增翻译键时，zh/en 必须同步补全（Dict 接口约束，缺一处编译报错）

export type Lang = "zh" | "en";
export type LangSetting = "auto" | Lang;

export const LANG_OPTIONS: Record<Lang, string> = {
	en: "English",
	zh: "简体中文",
};

export interface Dict {
	settings: {
		language: string;
		languageDesc: string;
		newTabOpens: string;
		newTabOpensDesc: string;
		defaultNewTabPage: string;
		defaultNewTabPageDesc: string;
		mode: string;
		modeDesc: string;
		compatibilityMode: string;
		compatibilityModeDesc: string;
	};
	notices: {
		pluginNotEnabled: string;
		invalidPath: (path: string) => string;
	};
	// 下拉选项显示名（值 = 命令 id，不可翻译；显示名按语言取）
	whatToOpenOptions: Record<string, string>;
	modeOptions: Record<string, string>;
}

const zh: Dict = {
	settings: {
		language: "语言 / Language",
		languageDesc: "设置界面显示语言（auto = 跟随 Obsidian 界面语言）。",
		newTabOpens: "新标签页打开…",
		newTabOpensDesc: "创建新标签页时打开的内容。（除「新标签页」外，需要启用对应的插件。）",
		defaultNewTabPage: "默认新标签页",
		defaultNewTabPageDesc:
			"新标签页中打开的笔记路径。图片和 PDF 也可以。仅在以上设置为「新标签页」时生效。",
		mode: "模式",
		modeDesc: "选择默认新标签页的打开模式。",
		compatibilityMode: "兼容模式",
		compatibilityModeDesc:
			"为其他会打开新标签页的插件（如 Obsidian Projects）启用兼容模式。会引入轻微延迟。",
	},
	notices: {
		pluginNotEnabled: "新标签页对应的插件未启用。",
		invalidPath: (path) => `${path} 不是 vault 中有效的笔记路径。`,
	},
	whatToOpenOptions: {
		"new-tab-page": "新标签页",
		"daily-notes": "每日笔记（核心插件）",
		"periodic-notes:open-daily-note": "每日笔记（Periodic Notes 插件）",
		"periodic-notes:open-weekly-note": "每周笔记（Periodic Notes 插件）",
		"periodic-notes:open-monthly-note": "每月笔记（Periodic Notes 插件）",
		"random-note": "随机笔记（核心插件）",
		"switcher:open": "快速切换器（核心插件）",
		"obsidian-another-quick-switcher:search-command_recent-search": "Another Quick Switcher",
		"darlal-switcher-plus:switcher-plus:open": "Quick Switcher++",
	},
	modeOptions: {
		"obsidian-default": "Obsidian 默认",
		"live-preview": "实时预览",
		"reading-mode": "阅读模式",
		"source-mode": "源码模式",
	},
};

const en: Dict = {
	settings: {
		language: "Language",
		languageDesc: "Display language of the settings UI (auto = follow Obsidian's UI language).",
		newTabOpens: "New tab opens…",
		newTabOpensDesc:
			"What to open when a new tab is created. (Except for the new tab page, the respective plugin needs to be enabled.)",
		defaultNewTabPage: "Default new tab page",
		defaultNewTabPageDesc:
			"Path of the note that will be opened in new tabs. Images and PDFs also work. Only takes effect when the setting above is 'New Tab Page'.",
		mode: "Mode",
		modeDesc: "Select the mode in which the default new tab page will be opened.",
		compatibilityMode: "Compatibility mode",
		compatibilityModeDesc:
			"Enable compatibility mode for other plugins (e.g. Obsidian Projects) which open new tabs. This introduces minor delays.",
	},
	notices: {
		pluginNotEnabled: "Plugin for the New Tab Page is not enabled.",
		invalidPath: (path) => `${path} is not a valid path to a note in your vault.`,
	},
	whatToOpenOptions: {
		"new-tab-page": "New Tab Page",
		"daily-notes": "Daily Note (Core Plugin)",
		"periodic-notes:open-daily-note": "Daily Note (Periodic Notes Plugin)",
		"periodic-notes:open-weekly-note": "Weekly Note (Periodic Notes Plugin)",
		"periodic-notes:open-monthly-note": "Monthly Note (Periodic Notes Plugin)",
		"random-note": "Random Note (Core Plugin)",
		"switcher:open": "Quick Switcher (Core Plugin)",
		"obsidian-another-quick-switcher:search-command_recent-search":
			"Another Quick Switcher",
		"darlal-switcher-plus:switcher-plus:open": "Quick Switcher++",
	},
	modeOptions: {
		"obsidian-default": "Obsidian Default",
		"live-preview": "Live Preview",
		"reading-mode": "Reading Mode",
		"source-mode": "Source Mode",
	},
};

const dicts: Record<Lang, Dict> = { zh, en };

/** 解析语言设置 → 实际语言 */
export function detectLang(setting: LangSetting, uiLocale: string): Lang {
	if (setting === "zh" || setting === "en") return setting;
	return uiLocale.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function getDict(lang: Lang): Dict {
	return dicts[lang];
}
