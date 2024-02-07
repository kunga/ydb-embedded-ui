import React from 'react';
import {connect} from 'react-redux';

import ContentWrapper, {Content} from './Content';
import ReduxTooltip from '../ReduxTooltip/ReduxTooltip';
import AppIcons from '../AppIcons/AppIcons';
import {Navigation} from '../AsideNavigation/Navigation';

import {registerLanguages} from '../../utils/monaco';
import {ErrorBoundary} from '../../components/ErrorBoundary/ErrorBoundary';
import {settings} from '../UserSettings/settings';
import {Providers} from './Providers';

import type {Store} from 'redux';
import type {History} from 'history';
import type {YDBEmbeddedUISettings} from '../UserSettings/settings';

import './App.scss';

registerLanguages();

export interface AppProps {
    store: Store;
    history: History;
    singleClusterMode: boolean;
    userSettings?: YDBEmbeddedUISettings;
    children?: React.ReactNode;
}

function App({store, history, singleClusterMode, children, userSettings = settings}: AppProps) {
    return (
        <Providers store={store} history={history}>
            <ContentWrapper>
                <Navigation userSettings={userSettings}>
                    <ErrorBoundary>
                        <Content singleClusterMode={singleClusterMode}>{children}</Content>
                        <div id="fullscreen-root"></div>
                    </ErrorBoundary>
                </Navigation>
            </ContentWrapper>
            <ReduxTooltip />
            <AppIcons />
        </Providers>
    );
}

function mapStateToProps(state: any) {
    return {
        singleClusterMode: state.singleClusterMode,
    };
}

export default connect(mapStateToProps)(App);
