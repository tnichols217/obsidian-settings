import {Setting, PluginSettingTab} from 'obsidian'

export interface SettingItem<T> {
	value: T
	name?: string
	desc?: string
}

export function display(obj: any, DEFAULT_SETTINGS: any, name: string) {
	const { containerEl } = obj;
	containerEl.empty();
	containerEl.createEl('h2', { text: 'Settings for ' + name });

	let keyvals = Object.entries(DEFAULT_SETTINGS)

	for (let keyval of keyvals) {
		let setting = new Setting(containerEl)
			.setName(keyval[1].name)
			.setDesc(keyval[1].desc)

		if (typeof keyval[1].value == "boolean") {
			setting.addToggle(toggle => toggle
				.setValue((obj.plugin.settings as any)[keyval[0]].value)
				.onChange((bool) => {
					(obj.plugin.settings as any)[keyval[0]].value = bool
					obj.plugin.saveSettings()
				})
			)
		} else {
			setting.addText(text => text
				.setPlaceholder(String(keyval[1].value))
				.setValue(String((obj.plugin.settings as any)[keyval[0]].value))
				.onChange((value) => {
					(obj.plugin.settings as any)[keyval[0]].value = obj.plugin.parseObject(value, typeof keyval[1].value)
					obj.plugin.saveSettings()
				})
			)
		}
	}
}

export function loadSettings(obj: any, DEFAULT_SETTINGS: any) {
	obj.settings = DEFAULT_SETTINGS
	obj.loadData().then((data: any) => {
		if (data) {
			let items = Object.entries(data)
			items.forEach((item:[string, string]) => {
				(obj.settings as any)[item[0]].value = item[1]
			})
		}
	})
}

export async function saveSettings(obj: any, DEFAULT_SETTINGS: any) {
	let saveData:any = {}
	Object.entries(obj.settings).forEach((i) => {
		saveData[i[0]] = (i[1] as SettingItem<any>).value
	})
	await obj.saveData(saveData);
}