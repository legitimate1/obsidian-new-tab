// DOCS https://marcus.se.net/obsidian-plugin-docs/user-interface/settings#register-a-settings-tab
import { App, PluginSettingTab, Setting } from "obsidian";
import defaultNewTabPage from "./main";
import { LANG_OPTIONS, type Lang } from "./i18n";

export class DefaultNewTabPageSettingTab extends PluginSettingTab {
	plugin: defaultNewTabPage;

	constructor(app: App, plugin: defaultNewTabPage) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const t = this.plugin.t;

		containerEl.empty();

		new Setting(containerEl)
			.setName(t.settings.language)
			.setDesc(t.settings.languageDesc)
			.addDropdown((dropdown) => {
				dropdown
					.addOption("auto", `auto (${LANG_OPTIONS[this.plugin.uiLang]})`)
					.addOptions(LANG_OPTIONS)
					.setValue(this.plugin.settings.language)
					.onChange(async (value) => {
						this.plugin.settings.language = value as Lang | "auto";
						await this.plugin.saveSettings();
						this.display(); // 切换语言立即生效
					});
			});

		new Setting(containerEl)
			.setName(t.settings.newTabOpens)
			.setDesc(t.settings.newTabOpensDesc)
			.addDropdown((dropdown) => {
				const options: Record<string, string> = {};
				for (const [id, label] of Object.entries(t.whatToOpenOptions)) {
					options[id] = label;
				}
				dropdown
					// INFO: except for the new tab page, the values should be equal to
					// the command-id to run
					.addOptions(options)
					.setValue(this.plugin.settings.whatToOpen)
					.onChange(async (value) => {
						this.plugin.settings.whatToOpen = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(t.settings.defaultNewTabPage)
			.setDesc(t.settings.defaultNewTabPageDesc)
			.addText((text) =>
				text
					.setPlaceholder("Meta/Homepage.md")
					.setValue(this.plugin.settings.filePath)
					.onChange(async (value) => {
						this.plugin.settings.filePath = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t.settings.mode)
			.setDesc(t.settings.modeDesc)
			.addDropdown((dropdown) => {
				const options: Record<string, string> = {};
				for (const [id, label] of Object.entries(t.modeOptions)) {
					options[id] = label;
				}
				dropdown
					.addOptions(options)
					.setValue(this.plugin.settings.mode)
					.onChange(async (value) => {
						this.plugin.settings.mode = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(this.containerEl)
			.setName(t.settings.compatibilityMode)
			.setDesc(t.settings.compatibilityModeDesc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.compatibilityMode).onChange(async (value) => {
					this.plugin.settings.compatibilityMode = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
