import {TRACING_LEVELS} from '../../utils/query';
import type {IsolationLevel, StatisticsMode} from '../store/query';

// ==== types from backend protos ====
interface Position {
    row?: number;
    column?: number;
    file?: string;
}

/** source: https://github.com/ydb-platform/ydb/blob/main/ydb/public/api/protos/ydb_issue_message.proto */
export interface IssueMessage {
    position?: Position;
    end_position?: Position;
    message?: string;
    issue_code?: number;
    severity?: number;
    issues?: IssueMessage[];
}

/** incomplete */
interface TDqStageStats {}

/** incomplete */
interface TKqpStatsCompile {}

interface TDqTableStats {
    TablePath?: string;
    /** uint64 */
    ReadRows?: string | number;
    /** uint64 */
    ReadBytes?: string | number;
    /** uint64 */
    WriteRows?: string | number;
    /** uint64 */
    WriteBytes?: string | number;
    /** uint64 */
    EraseRows?: string | number;
    /** uint64 */
    EraseBytes?: string | number;
    AffectedPartitions?: number;
    Extra?: unknown;
}

/** source: https://github.com/ydb-platform/ydb/blob/main/ydb/library/yql/dq/actors/protos/dq_stats.proto */
interface TDqExecutionStats {
    /** uint64 */
    CpuTimeUs?: string | number;
    /** uint64 */
    DurationUs?: string | number;
    /** uint64 */
    ResultRows?: string | number;
    /** uint64 */
    ResultBytes?: string | number;

    Tables?: TDqTableStats[];

    /** uint64 */
    ExecuterCpuTimeUs?: string | number;
    /** uint64 */
    StartTimeMs?: string | number;
    /** uint64 */
    FinishTimeMs?: string | number;
    /** uint64 */
    FirstRowTimeMs?: string | number;

    Stages?: TDqStageStats[];
    TxPlansWithStats?: string[];

    Extra: unknown;
}

/** source: https://github.com/ydb-platform/ydb/blob/main/ydb/core/protos/kqp_stats.proto */
export interface TKqpStatsQuery {
    /** uint64 */
    DurationUs?: string | number;
    Compilation?: TKqpStatsCompile;

    /** uint64 */
    WorkerCpuTimeUs?: string | number;
    /** uint64 */
    ReadSetsCount?: string | number;
    /** uint64 */
    MaxShardProgramSize?: string | number;
    /** uint64 */
    MaxShardReplySize?: string | number;

    Executions?: TDqExecutionStats[];
}

// ==== Self-written types ====
// ==== Meta version 0.2 ====
// Backend code: https://github.com/ydb-platform/ydb/blob/main/ydb/core/kqp/opt/kqp_query_plan.cpp

// ==== Plan ====
export interface PlanMeta {
    version: string;
    type: 'script' | 'query';
}

export interface PlanTable {
    name: string;
    reads?: {
        type: string;
        lookup_by?: string[];
        scan_by?: string[];
        limit?: string;
        reverse?: boolean;
        columns?: string[];
    }[];
    writes?: {
        type: string;
        key?: string[];
        columns?: string[];
    }[];
}

interface PlanNodeStats {
    TotalCpuTimeUs?: number;
    TotalTasks?: number;
    TotalInputBytes?: number;
    TotalInputRows?: number;
    TotalOutputBytes?: number;
    TotalDurationMs?: number;
    TotalOutputRows?: number;

    ComputeNodes?: unknown[];
    NodesScanShards?: unknown[];
    UseLlvm?: unknown;
}

interface PlanNodeOperator {
    Name: string;
    Limit?: string;
    ReadLimit?: string;
    ReadColumns?: string[];
    ReadRanges?: string[];
    ReadRange?: string[];
    Table?: string;
    Iterator?: string;
}

interface CommonPlanNode {
    PlanNodeId?: number;
    'Node Type'?: string;
    PlanNodeType?: string;
}

export interface PlanNode extends CommonPlanNode {
    Operators?: PlanNodeOperator[];
    Tables?: string[];
    Plans?: PlanNode[];
    Stats?: PlanNodeStats;
    'CTE Name'?: string;
    'Subplan Name'?: string;
    'Parent Relationship'?: string;
}

export interface SimlifiedPlanOperatorOtherParams {
    [key: string]: string | number | string[] | Record<string, unknown> | undefined;
}
interface SimlifiedPlanOperator extends SimlifiedPlanOperatorOtherParams {
    'E-Rows'?: string;
    'A-Rows'?: number;
    'A-Cpu'?: number;
    Name: string;
    'E-Size'?: string;
    'E-Cost'?: string;
}
export interface SimplifiedNode extends CommonPlanNode {
    Plans?: SimplifiedNode[];
    Operators?: [SimlifiedPlanOperator];
}

export interface ScriptPlan {
    queries?: {
        Plan?: PlanNode;
        SimplifiedPlan?: SimplifiedNode;
        tables?: PlanTable[];
    }[];
    meta: PlanMeta;
}

export interface QueryPlan {
    Plan?: PlanNode;
    SimplifiedPlan?: SimplifiedNode;
    tables?: PlanTable[];
    meta: PlanMeta;
}

// ==== Common types ====

export type CellValue = string | number | null | undefined;

export type KeyValueRow<T = CellValue> = {
    [key: string]: T;
};

export type ArrayRow<T = CellValue> = Array<T>;

export interface ColumnType {
    name: string;
    type: string;
}

export const TracingLevelNumber = {
    [TRACING_LEVELS.off]: 0,
    [TRACING_LEVELS.toplevel]: 4,
    [TRACING_LEVELS.basic]: 9,
    [TRACING_LEVELS.detailed]: 13,
    [TRACING_LEVELS.diagnostic]: 14,
    [TRACING_LEVELS.trace]: 15,
};

/** undefined = 'none' */
export type Stats = StatisticsMode;

/** undefined = '60000' */
export type Timeout = number;

/** undefined = 'serializable-read-write' */
export type TransactionMode = IsolationLevel;

/** undefined = '15' */
export type TracingLevel = number;

/** undefined = 'classic' */
export type Schemas = 'classic' | 'modern' | 'ydb' | 'multi' | undefined;

/** undefined = 'execute' */
export type ExecuteActions =
    | 'execute'
    | 'execute-scan'
    | 'execute-script'
    | 'execute-data'
    | 'execute-query'
    | undefined;

export type ExplainActions =
    | 'explain'
    | 'explain-scan'
    | 'explain-script'
    | 'explain-data'
    | 'explain-query'
    | 'explain-ast';

export type Actions = ExecuteActions | ExplainActions;

// ==== Error response ====

export interface ErrorResponse {
    error?: IssueMessage;
    issues?: IssueMessage[] | null;
}

// ==== Explain Responses ====
/**
 * meta.type = 'script'
 *
 * explain-script
 */
export interface ExplainScriptResponse {
    plan?: ScriptPlan;
}
/**
 * meta.type = 'query'
 *
 * explain, explain-scan, explain-data, explain-query, explain-ast
 */
export interface ExplainQueryResponse {
    ast?: string;
    plan?: QueryPlan;
}

export type ExplainResponse<Action extends ExplainActions> = Action extends 'explain-script'
    ? ExplainScriptResponse
    : ExplainQueryResponse;

// ==== Execute Results ====

interface ModernSchemaResult {
    result?: ArrayRow[];
    columns?: ColumnType[];
}
interface MultiSchemaResult {
    result?: {
        rows?: ArrayRow[] | null;
        columns?: ColumnType[];
    }[];
}
interface DefaultSchemaResult {
    result?: KeyValueRow[];
}

// ==== Execute Responses ====

type ResultFields<Schema extends Schemas> = Schema extends 'modern'
    ? ModernSchemaResult
    : Schema extends 'multi'
      ? MultiSchemaResult
      : DefaultSchemaResult;

/**
 * meta.type = 'query'
 *
 * execute-scan, execute-data, execute-query
 */
export type ExecuteQueryResponse<Schema extends Schemas> = {
    plan?: QueryPlan;
    ast?: string;
    stats?: TKqpStatsQuery;
} & ResultFields<Schema>;

/**
 * meta.type = 'script'
 *
 * execute, execute-script
 */
export type ExecuteScriptResponse<Schema extends Schemas> = {
    plan?: ScriptPlan;
    ast?: string;
    stats?: TKqpStatsQuery;
} & ResultFields<Schema>;

export type ExecuteResponse<Action extends ExecuteActions, Schema extends Schemas> = Action extends
    | 'execute-scan'
    | 'execute-data'
    | 'execute-query'
    ? ExecuteQueryResponse<Schema>
    : ExecuteScriptResponse<Schema>;

// ==== Combined API response ====
export type QueryAPIResponse<
    Action extends Actions,
    Schema extends Schemas,
> = Action extends ExplainActions
    ? ExplainResponse<Action>
    : Action extends ExecuteActions
      ? ExecuteResponse<Action, Schema>
      : unknown;

// ==== types to use in query result preparation ====
export type AnyExplainResponse = ExplainQueryResponse | ExplainScriptResponse;

export type ExecuteModernResponse =
    | ExecuteQueryResponse<'modern'>
    | ExecuteScriptResponse<'modern'>;
export type ExecuteMultiResponse = ExecuteQueryResponse<'multi'> | ExecuteScriptResponse<'multi'>;
export type ExecuteClassicResponse =
    | ExecuteQueryResponse<'classic'>
    | ExecuteScriptResponse<'classic'>;
export type ExecuteYdbResponse = ExecuteQueryResponse<'ydb'> | ExecuteScriptResponse<'ydb'>;

export type AnyExecuteResponse =
    | ExecuteModernResponse
    | ExecuteMultiResponse
    | ExecuteClassicResponse
    | ExecuteYdbResponse;
