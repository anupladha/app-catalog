Ext = window.Ext4 || window.Ext

Ext.require [
	'Rally.apps.chartbuilder.EaselAlmBridgeApi'
]

describe 'Rally.apps.chartbuilder.EaselAlmBridgeApi', ->

	helpers
		getContext: (initialValues) ->
			globalContext = Rally.environment.getContext()

			Ext.create 'Rally.app.Context',
				initialValues:Ext.merge
					project:globalContext.getProject()
					workspace:globalContext.getWorkspace()
					user:globalContext.getUser()
					subscription:globalContext.getSubscription()
					, initialValues

		createApi: (settings = {}) ->
			context = @getContext()
			app = {
				getContext : -> context
				getSettings : -> settings
			}
			api = Ext.create 'Rally.apps.chartbuilder.EaselAlmBridgeApi',
				chartType: 'xxx'
				app: app
			return api

	beforeEach ->
		@api = @createApi()

	it 'maintains the reference to the passed in chartType', ->
		expect(@api.getChartType()).toBe "xxx"

	it 'returns the appropriate LBAPI Url from the ALM Bridge', ->
		expect(@api.lbapiBaseUrl()).toBe '/analytics/v2.0'

	it 'returns the appropriate WSAPI Url from the ALM Bridge', ->
		expect(@api.wsapiBaseUrl()).toBe '/webservice/v2.x'

	it 'returns the appropriate workspace from the ALM Bridge', ->
		expect(@api.getWorkspace().ObjectID).toBe Rally.environment.getContext().getWorkspace().ObjectID

	it 'returns the appropriate project from the ALM Bridge', ->
		expect(@api.getProject().ObjectID).toBe Rally.environment.getContext().getProject().ObjectID

	it 'returns project settings', ->
		settings =
			project: 12345
		api = @createApi(settings)
		api.registerPreferences({ type: 'project-picker', name:'project' })
		expect(api.getSettings().project).toBe settings.project

	it 'has no default settings by default', ->
		expect(@api.getDefaultSettings()).toEqual {}

	it 'calculates default settings when registered', ->
		@api.registerPreferences([
			{type: 'text', name: 'has-default', label: 'Chart Title', default: 'the default value'},
			{type: 'text', name: 'has-no-default', label: 'Chart Sub-Title2'}
		])
		expect(@api.getDefaultSettings()['has-default']).toBe 'the default value'
		expect(@api.getDefaultSettings()['has-no-default']).toBeUndefined()
