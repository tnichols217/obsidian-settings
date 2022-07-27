import {Setting, PluginSettingTab} from 'obsidian'

export interface SettingItem<T> {
	value: T
	name?: string
	desc?: string
}

let parseBoolean = (value: string) => {
	return (value == "yes" || value == "true")
}

let parseObject = (value: any, typ: string) => {
	if (typ == "string") {
		return value
	}
	if (typ == "boolean") {
		return parseBoolean(value)
	}
	if (typ == "number") {
		return parseFloat(value)
	}
}

export function createSetting(containerEl: any, keyval: [string, SettingItem<any>], currentValue: any, onChange: (value: any, key: string) => void) {

	let setting = new Setting(containerEl)
			.setName(keyval[1].name)
			.setDesc(keyval[1].desc)

		if (typeof keyval[1].value == "boolean") {
			setting.addToggle(toggle => toggle
				.setValue(currentValue)
				.onChange((bool) => {
					onChange(bool, keyval[0])
				})
			)
		} else {
			setting.addText(text => text
				.setPlaceholder(String(keyval[1].value))
				.setValue(String(currentValue))
				.onChange((value) => {
					onChange(parseObject(value, typeof keyval[1].value), keyval[0])
				})
			)
		}
}

export function display(obj: any, DEFAULT_SETTINGS: any, name: string) {
	const { containerEl } = obj;
	containerEl.empty();
	containerEl.createEl('h2', { text: 'Settings for ' + name });

	let keyvals = (Object.entries(DEFAULT_SETTINGS) as [string, SettingItem<any>][])

	for (let keyval of keyvals) {
		createSetting(containerEl, keyval, (obj.plugin.settings as any)[keyval[0]].value, (value, key) => {
			(obj.plugin.settings as any)[key].value = value
			obj.plugin.saveSettings()
		})
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