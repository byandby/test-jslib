import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import helper from 'test-rl'

import { CLUSTER_LIST } from './redux/modules/cluster'

const List = ({ data, fetchClusters }) => {
  useEffect(() => {
    fetchClusters()
  }, [fetchClusters])

  return <div>{JSON.stringify(data)}</div>
}

List.defaultProps = {
  status: null,
}

List.propTypes = {
  data: PropTypes.arrayOf(PropTypes.obj),
}

const dataSelector = helper.createDataSelector(CLUSTER_LIST)

const mapStateToProps = state => {
  return {
    data: dataSelector(state),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchClusters: () => dispatch({ type: CLUSTER_LIST }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List)
