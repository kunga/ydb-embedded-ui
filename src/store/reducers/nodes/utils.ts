import type {TComputeInfo, TComputeNodeInfo} from '../../../types/api/compute';
import type {TNodesInfo} from '../../../types/api/nodes';
import {calcUptime} from '../../../utils';

import type {NodesHandledResponse, NodesPreparedEntity} from './types';

const prepareComputeNode = (node: TComputeNodeInfo, tenantName?: string) => {
    return {
        ...node,
        // v2 response has tenant name, v1 - doesn't
        TenantName: node.Tenant ?? tenantName,
        SystemState: node?.Overall,
        Uptime: calcUptime(node?.StartTime),
    };
};

export const prepareComputeNodesData = (data: TComputeInfo): NodesHandledResponse => {
    const preparedNodes: NodesPreparedEntity[] = [];

    // First try to parse v2 response in case backend supports it
    // Else parse v1 response
    if (data.Nodes) {
        data.Nodes.forEach((node) => {
            preparedNodes.push(prepareComputeNode(node));
        });
    } else if (data.Tenants) {
        for (const tenant of data.Tenants) {
            tenant.Nodes?.forEach((node) => {
                preparedNodes.push(prepareComputeNode(node, tenant.Name));
            });
        }
    }

    return {
        Nodes: preparedNodes,
        TotalNodes: Number(data.TotalNodes) || preparedNodes.length,
        FoundNodes: Number(data.FoundNodes),
    };
};

export const prepareNodesData = (data: TNodesInfo): NodesHandledResponse => {
    const rawNodes = data.Nodes || [];

    const preparedNodes = rawNodes.map((node) => {
        return {
            ...node.SystemState,
            Tablets: node.Tablets,
            NodeId: node.NodeId,
            Uptime: calcUptime(node.SystemState?.StartTime),
            TenantName: node.SystemState?.Tenants?.[0],
        };
    });

    return {
        Nodes: preparedNodes,
        TotalNodes: Number(data.TotalNodes) || preparedNodes.length,
        FoundNodes: Number(data.FoundNodes),
    };
};