import React, { PropTypes } from 'react'
import Nearby from './NearbyComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'
import { runGeoLoc } from 'shared/utils/geoloc-utils'
import { Loading } from 'shared/components/addon/loading'
import { isEmpty } from 'lodash'

if (process.env.BROWSER) {
  require('css/addon/pin')
  require('css/addon/nearby')
}

class NearbyHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = context.store
    dispatch(updateTitle('title.nearby'))

    const center = { lat: 25.018536, lng: 121.529146 }
    dispatch(SearchActions.updateNearbyCenter({ center }))

    runGeoLoc().then((position) => {
      dispatch(SearchActions.nearby({
        dist: 3000,   // 3 km
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }, 50)).then((info) => {
        const { pattern } = info
        setTimeout(() => {
          dispatch(SearchActions.updateNearbyCenter({
            center: { lat: pattern.lat, lng: pattern.lng }
          }))
        }, 500)
      })
    }).catch((err) => {
      // fallback
      dispatch(SearchActions.nearby({
        dist: 1000,
        lat: center[0],
        lng: center[1]
      }, 30)).then(() => {
        setTimeout(() => {
          dispatch(SearchActions.updateNearbyCenter({ center }))
        }, 500)
      })
    })
  }

  componentDidMount () {
    Loading.show('正在努力找尋您附近的活動...')
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.search.isFetching) {
      setTimeout(() => {
        Loading.hide()
      }, 5000)
    }
  }

  render () {
    const { dispatch, search } = this.props

    const title = this._T('title.nearby')
    const defaultTitle = this._T('title.site')

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Nearby
          {...this.props}
          {...bindActionCreators(SearchActions, dispatch)}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  search: state.search
}))(NearbyHandler)
