import {EFlag} from './enums';
import {TPDiskStateInfo} from './pdisk';

export interface TVDiskStateInfo {
    VDiskId?: TVDiskID;
    /** uint64 */
    CreateTime?: string;
    /** uint64 */
    ChangeTime?: string;
    PDisk?: TPDiskStateInfo;
    VDiskSlotId?: number;
    /** uint64 */
    Guid?: string;
    /** uint64 */
    Kind?: string;
    NodeId?: number;
    Count?: number;

    Overall?: EFlag;

    /** Current state of VDisk */
    VDiskState?: EVDiskState;
    /** Disk space flags */
    DiskSpace?: EFlag;
    /** Compaction satisfaction rank */
    SatisfactionRank?: TVDiskSatisfactionRank;
    /** Is VDisk replicated? (i.e. contains all blobs it must have) */
    Replicated?: boolean;
    /** Does this VDisk has any yet unreplicated phantom-like blobs? */
    UnreplicatedPhantoms?: boolean;
    /** The same for the non-phantom-like blobs. */
    UnreplicatedNonPhantoms?: boolean;
    /**
     * uint64
     * How many unsynced VDisks from current BlobStorage group we see
     */
    UnsyncedVDisks?: string;
    /**
     * uint64
     * How much this VDisk have allocated on corresponding PDisk
     */
    AllocatedSize?: string;
    /**
     * uint64
     * How much space is available for VDisk corresponding to PDisk's hard space limits
     */
    AvailableSize?: string;
    /** Does this disk has some unreadable but not yet restored blobs? */
    HasUnreadableBlobs?: boolean;
    /** fixed64 */
    IncarnationGuid?: string;
    DonorMode?: boolean;
    /**
     * fixed64
     * VDisk actor instance guid
     */
    InstanceGuid?: string;
    // in reality it is `Donors: TVDiskStateInfo[] | TVSlotId[]`, but this way it is more error-proof
    Donors?: Array<TVDiskStateInfo | TVSlotId>;

    /** VDisk (Skeleton) Front Queue Status */
    FrontQueues?: EFlag;

    /** VDisk storage pool label */
    StoragePoolName?: string;

    /**
     * uint64
     * Read bytes per second from PDisk for TEvVGet blobs only
     */
    ReadThroughput?: string;
    /**
     * uint64
     * Write bytes per second to PDisk for TEvVPut blobs and replication bytes only
     */
    WriteThroughput?: string;
}

export interface TVSlotId {
    NodeId?: number;
    PDiskId?: number;
    VSlotId?: number;
}

interface TVDiskSatisfactionRank {
    FreshRank?: TRank;
    LevelRank?: TRank;
}

interface TVDiskID {
    GroupID?: number;
    GroupGeneration?: number;
    Ring?: number;
    Domain?: number;
    VDisk?: number;
}

interface TRank {
    /**
     * Rank in percents; 0-100% is good; >100% is bad.
     * Formula for rank calculation is the following:
     * Rank = actual_value / max_allowed_value * 100
     */
    RankPercent?: number;

    /**
     * Flag is the Rank transformed to something simple
     * to understand: Green, Yellow or Red
     */
    Flag?: EFlag;
}

enum EVDiskState {
    Initial = 'Initial',
    LocalRecoveryError = 'LocalRecoveryError',
    SyncGuidRecovery = 'SyncGuidRecovery',
    SyncGuidRecoveryError = 'SyncGuidRecoveryError',
    OK = 'OK',
    PDiskError = 'PDiskError',
}