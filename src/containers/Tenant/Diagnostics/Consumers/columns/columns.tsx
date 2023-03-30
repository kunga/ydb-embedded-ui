import DataTable, {Column} from '@gravity-ui/react-data-table';
import block from 'bem-cn-lite';
import qs from 'qs';

import type {IPreparedConsumerData} from '../../../../../types/store/topic';
import {SpeedMultiMeter} from '../../../../../components/SpeedMultiMeter';
import {InternalLink} from '../../../../../components/InternalLink';
import {formatMsToUptime} from '../../../../../utils';
import routes, {createHref} from '../../../../../routes';

import {TenantTabsGroups} from '../../../TenantPages';
import {GeneralPagesIds} from '../../DiagnosticsPages';

import {
    CONSUMERS_COLUMNS_IDS,
    CONSUMERS_COLUMNS_TITILES,
    CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS,
    CONSUMERS_READ_LAGS_SUB_COLUMNS_TITLES,
} from '../utils/constants';

import {ReadLagsHeader} from '../Headers';

import './Columns.scss';

const b = block('ydb-diagnostics-consumers-columns');

export const columns: Column<IPreparedConsumerData>[] = [
    {
        name: CONSUMERS_COLUMNS_IDS.CONSUMER,
        header: CONSUMERS_COLUMNS_TITILES[CONSUMERS_COLUMNS_IDS.CONSUMER],
        align: DataTable.LEFT,
        render: ({row}) => {
            if (!row.name) {
                return '–';
            }

            const queryParams = qs.parse(location.search, {
                ignoreQueryPrefix: true,
            });

            return (
                <InternalLink
                    to={createHref(routes.tenant, undefined, {
                        ...queryParams,
                        [TenantTabsGroups.generalTab]: GeneralPagesIds.partitions,
                        selectedConsumer: row.name,
                    })}
                >
                    {row.name}
                </InternalLink>
            );
        },
    },
    {
        name: CONSUMERS_COLUMNS_IDS.READ_SPEED,
        header: CONSUMERS_COLUMNS_TITILES[CONSUMERS_COLUMNS_IDS.READ_SPEED],
        align: DataTable.RIGHT,
        sortAccessor: (row) => row.readSpeed.perMinute,
        render: ({row}) => <SpeedMultiMeter data={row.readSpeed} />,
    },
    {
        name: CONSUMERS_COLUMNS_IDS.READ_LAGS,
        header: <ReadLagsHeader />,
        className: b('lags-header'),
        sub: [
            {
                name: CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS.WRITE_LAG,
                header: CONSUMERS_READ_LAGS_SUB_COLUMNS_TITLES[
                    CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS.WRITE_LAG
                ],
                align: DataTable.RIGHT,
                render: ({row}) => formatMsToUptime(row.writeLag),
            },
            {
                name: CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS.READ_LAG,
                header: CONSUMERS_READ_LAGS_SUB_COLUMNS_TITLES[
                    CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS.READ_LAG
                ],
                align: DataTable.RIGHT,
                render: ({row}) => formatMsToUptime(row.readLag),
            },
            {
                name: CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS.READ_IDLE_TIME,
                header: CONSUMERS_READ_LAGS_SUB_COLUMNS_TITLES[
                    CONSUMERS_READ_LAGS_SUB_COLUMNS_IDS.READ_IDLE_TIME
                ],
                align: DataTable.RIGHT,
                render: ({row}) => formatMsToUptime(row.readIdleTime),
            },
        ],
    },
];