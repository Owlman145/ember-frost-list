import Ember from 'ember'
const { on } = Ember
import computed from 'ember-computed-decorators'
import {normalizeSort, defaultSort} from 'ember-frost-list/utils/utils'

export default Ember.Controller.extend({

  _listItems: Ember.computed.alias('model'),

  @computed('_listItems.[]')
  listItems (listItems) {
    let wrapper = []
    return listItems.map((item) => {
      return wrapper.pushObject(Ember.Object.create({
        id: item.id,
        record: item
      }))
    })
  },

  @computed('listItems.[]', 'selectedItems', 'expandedItems')
  statefulListItems (listItems, selectedItems, expandedItems) {
    return listItems.map((item) => {
      item.set('isSelected', selectedItems.getWithDefault(item.id, false))
      item.set('isExpanded', expandedItems.getWithDefault(item.id, false))
      return item
    })
  },

  // == Event =================================================================
  initListSelectionMixin: on('init', function () {
    this.set('expandedItems', Ember.Object.create())
    this.set('selectedItems', Ember.Object.create())
  }),

  // == Functions ==============================================================
  updateSelectedItemsHash (selections, attrs) {
    let _selections = selections
    if (attrs.selectDesc.isSelected) {
      if (attrs.selectDesc.isShiftSelect) {
        attrs.records.forEach((record) => {
          _selections.set(record.id, true)
        })
      } else {
        if ((!attrs.selectDesc.isTargetSelectionIndicator &&
          !attrs.selectDesc.isCtrlSelect)) {
          Object.keys(_selections).forEach((key) => {
            _selections.set(key, false)
          })
        }
        attrs.records.forEach((record) => {
          _selections.set(record.id, true)
        })
      }
    } else {
      attrs.records.forEach((record) => {
        _selections.set(record.id, false)
      })
    }
    return _selections
  },

  sortableProperties: [
    {
      value: 'label',
      label: 'Label'
    },
    {
      value: 'id',
      label: 'Id'
    }
  ],

  activeSorting: [
    {
      value: 'label', direction: ':desc'
    }
  ],

  // == Computed Properties ===================================

  // == Actions ===============================================
  actions: {
    selectItem (attrs) {
      let selectedItems = this.get('selectedItems')
      this.set('selectedItems',
        this.updateSelectedItemsHash(selectedItems, attrs))
      this.notifyPropertyChange('selectedItems')
    },

    collapseItems () {
      let records = this.get('listItems')
      let expandedItems = this.get('expandedItems')
      records.map((record) => {
        expandedItems.set(record.id, false)
      })
      this.notifyPropertyChange('expandedItems')
    },

    expandItems () {
      let records = this.get('listItems')
      let expandedItems = this.get('expandedItems')
      records.map((record) => {
        expandedItems.set(record.id, true)
      })
      this.notifyPropertyChange('expandedItems')
    },

    collapseItem () {

    },

    expandItem () {

    },

    sortItems (sortProperties) {
      let filteredSortProperties = sortProperties.map(function (item) {
        return {value: item.value, direction: item.direction}
      })
      let normalizedSortProperties = normalizeSort(filteredSortProperties)
      const dataKey = this.get('listConfig.items')
      this.set(dataKey, defaultSort(this.get(dataKey), normalizedSortProperties))
    }
  }
})
