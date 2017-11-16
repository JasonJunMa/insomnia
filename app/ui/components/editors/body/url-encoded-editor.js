// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import KeyValueEditor from '../../key-value-editor/editor';
import {trackEvent} from '../../../../analytics/index';
import type {RequestBodyParameter} from '../../../../models/request';

type Props = {
  onChange: Function,
  parameters: Array<RequestBodyParameter>,
  inheritedParameters: Array<RequestBodyParameter> | null,
  nunjucksPowerUserMode: boolean,

  // Optional
  handleRender: ?Function,
  handleGetRenderContext: ?Function
}

@autobind
class UrlEncodedEditor extends React.PureComponent<Props> {
  _generateParametersKey (parameters: Array<RequestBodyParameter>) {
    const keyParts = [];
    for (const parameter of parameters) {
      const segments = [
        parameter.name,
        parameter.value || '',
        parameter.disabled ? 'disabled' : 'enabled'
      ];
      keyParts.push(segments.join(':::'));
    }

    return keyParts.join('_++_');
  }

  _handleTrackToggle (pair: RequestBodyParameter) {
    trackEvent(
      'Url Encoded Editor',
      'Toggle',
      pair.disabled ? 'Disable' : 'Enable'
    );
  }

  _handleTrackCreate () {
    trackEvent('Url Encoded Editor', 'Create');
  }

  _handleTrackDelete () {
    trackEvent('Url Encoded Editor', 'Delete');
  }

  render () {
    const {
      parameters,
      inheritedParameters,
      onChange,
      handleRender,
      handleGetRenderContext,
      nunjucksPowerUserMode
    } = this.props;

    return (
      <div className="scrollable-container tall wide">
        <div className="scrollable">
          <div className="pad-top">
            {inheritedParameters && inheritedParameters.length ? [
              <label key="label" className="label--small pad-left">
                Inherited Items
              </label>,
              <KeyValueEditor
                key={this._generateParametersKey(inheritedParameters)}
                disabled
                readOnly
                sortable
                allowMultiline
                namePlaceholder="name"
                valuePlaceholder="value"
                handleRender={handleRender}
                handleGetRenderContext={handleGetRenderContext}
                nunjucksPowerUserMode={nunjucksPowerUserMode}
                pairs={inheritedParameters}
              />
            ] : null}
            {inheritedParameters && inheritedParameters.length ? (
              <label className="label--small pad-left pad-top">
                Items
              </label>
            ) : null}
            <KeyValueEditor
              sortable
              allowMultiline
              namePlaceholder="name"
              valuePlaceholder="value"
              className="pad-bottom"
              onChange={onChange}
              handleRender={handleRender}
              handleGetRenderContext={handleGetRenderContext}
              nunjucksPowerUserMode={nunjucksPowerUserMode}
              onToggleDisable={this._handleTrackToggle}
              onCreate={this._handleTrackCreate}
              onDelete={this._handleTrackDelete}
              pairs={parameters}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UrlEncodedEditor;
