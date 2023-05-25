import block from 'bem-cn-lite';

import {Progress} from '@gravity-ui/uikit';

import type {VersionValue} from '../../../types/versions';
import type {PreparedClusterNode} from '../../../store/reducers/clusterNodes/types';
import type {GroupedNodesItem} from '../types';

import './NodesTreeTitle.scss';

const b = block('ydb-versions-nodes-tree-title');

interface NodesTreeTitleProps {
    title?: string;
    nodes?: PreparedClusterNode[];
    items?: GroupedNodesItem[];
    versionColor?: string;
    versionsValues?: VersionValue[];
}

export const NodesTreeTitle = ({
    title,
    nodes,
    items,
    versionColor,
    versionsValues,
}: NodesTreeTitleProps) => {
    let nodesAmount;
    if (items) {
        nodesAmount = items.reduce((acc, curr) => {
            if (!curr.nodes) {
                return acc;
            }
            return acc + curr.nodes.length;
        }, 0);
    } else {
        nodesAmount = nodes ? nodes.length : 0;
    }

    return (
        <div className={b('overview')}>
            <div className={b('overview-container')}>
                {versionColor ? (
                    <div className={b('version-color')} style={{background: versionColor}} />
                ) : null}
                <span className={b('overview-title')}>{title}</span>
            </div>
            <div className={b('overview-info')}>
                <div>
                    <span className={b('info-value')}>{nodesAmount}</span>
                    <span className={b('info-label', {margin: 'left'})}>Nodes</span>
                </div>
                {versionsValues ? (
                    <div className={b('version-progress')}>
                        <span className={b('info-label', {margin: 'right'})}>Versions</span>
                        <Progress view="thin" value={100} stack={versionsValues} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};