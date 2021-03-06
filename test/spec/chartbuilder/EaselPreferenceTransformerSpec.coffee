Ext = window.Ext4 || window.Ext

Ext.require [
	'Rally.apps.chartbuilder.EaselPreferenceTransformer'
]

describe 'Rally.apps.chartbuilder.EaselPreferenceTransformer', ->

	helpers
		createXformer: ->
			return Ext.create 'Rally.apps.chartbuilder.EaselPreferenceTransformer'

	beforeEach ->
		@xformer = @createXformer()

	it 'properly handles an empty preferences list', ->
		preferences = []
		expected = []

		converted = @xformer.transform(preferences)
		expect(converted).toEqual expected

	it 'properly handles a null preferences list', ->
		preferences = null
		expected = []

		converted = @xformer.transform(preferences)
		expect(converted).toEqual expected

	it 'converts combobox into rallycombobox', ->
		preferences = [
			{
				type: 'combobox',
				name: 'color',
				label: 'Color Fool',
				default: 'red',
				values: [
					{label:'Red', value: 'red'},
					{label:'Blue', value: 'blue'},
					{label:'Black', value: 'black'}
				]
			}
		]

		expected = [
			{
				"xtype":"rallycombobox"
				"valueField":"value"
				"displayField":"label"
				"name":"color"
				"store":
					"xtype":"store"
					"fields":["label","value"]
					"data":[
						{"label":"Red","value":"red"}
						{"label":"Blue","value":"blue"}
						{"label":"Black","value":"black"}
					]
			}
		]

		converted = @xformer.transform(preferences)
		expect(converted).toEqual expected

	it 'does nothing to textbox', ->
		preferences = [
			{
				type: 'text',
				name: 'chart-title',
				label: 'Chart Title',
				default: 'Chart Title'
			}
		]

		converted = @xformer.transform(preferences)
		expect(converted).toEqual preferences



	it 'converts project-picker into settings project picker', ->
		preferences = [
			{ type: 'project-picker', name: 'xyzy' }
		]

		expected = [
			{
				type: 'project'
				name: 'xyzy'
				label: 'Project'
			}
		]

		converted = @xformer.transform(preferences)
		expect(converted).toEqual expected


	it 'should convert flat project-picker settings to a nice object', ->
		preferences = [
			{ type: 'project-picker', name:'zzzz' }
		]

		settings=
			project: '/project/1234'
			projectScopeUp : 'true'
			projectScopeDown: 'false'

		key = 'zzzz'

		value = @xformer.getValue(preferences, settings, key)
		expect(value.project).toBe 1234
		expect(value.scopeUp).toBe true
		expect(value.scopeDown).toBe false





	it 'converts milestone-picker into settings milestone picker', ->
		preferences = [
			{ type: 'milestone-picker', name: 'xyzy' }
		]

		expected = [
			{
				xtype: 'rallymilestonecombobox'
				name: 'xyzy'
				label: 'Milestone'
			}
		]

		converted = @xformer.transform(preferences)
		expect(converted).toEqual expected



	it 'should convert milestone-picker settings to a nice object', ->
		preferences = [
			{ type: 'milestone-picker', name:'zzzz' }
		]

		settings=
			zzzz: '/milestone/1234'

		key = 'zzzz'

		value = @xformer.getValue(preferences, settings, key)
		expect(value).toBe 1234
