import { expect } from 'chai'
import Ember from 'ember'
import {
  describeComponent,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import sinon from 'sinon'

describeComponent(
  'frost-list-expansion',
  'Integration: FrostListExpansionComponent',
  {
    integration: true
  },
  function () {
    it('renders', function () {
      const targetObject = {
        onCollapseAll: sinon.spy(),
        onExpandAll: sinon.spy()
      }

      this.render(hbs`
        {{frost-list-expansion
          targetObject=targetObject
          onCollapseAll='onCollapseAll'
          onExpandAll='onExpandAll'
        }}
      `)

      expect(
        this.$(),
        'class frost-list-expansion is set'
      ).to.be.length(1)
    })

    it('fires onExpandAll closure action', function () {
      const externalActionSpy = sinon.spy()

      this.on('externalActionSpy', externalActionSpy)

      this.render(hbs`
        {{frost-list-expansion
          onCollapseAll=(action 'externalActionSpy')
          onExpandAll=(action 'externalActionSpy')
        }}
      `)

      this.$('.frost-list-expansion-item').trigger('click')

      expect(
        externalActionSpy.called,
        'onExpandAll is fired'
      ).to.be.true
    })
  }
)
