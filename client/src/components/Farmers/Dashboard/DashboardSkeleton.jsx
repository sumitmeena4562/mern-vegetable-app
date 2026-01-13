import React from 'react';
import { Skeleton, SkeletonCircle } from '../../common/Skeleton';

const DashboardSkeleton = () => {
    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 relative z-10">

            {/* Welcome Section Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 h-48 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <Skeleton className="w-12 h-12 rounded-xl" />
                            <Skeleton className="w-16 h-6 rounded-lg" />
                        </div>
                        <div>
                            <Skeleton className="w-24 h-4 mb-2" />
                            <Skeleton className="w-32 h-8" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Panel Skeleton */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Chart Skeleton */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 h-96">
                        <div className="flex justify-between items-center mb-8">
                            <div className="space-y-2">
                                <Skeleton className="w-40 h-6" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                            <Skeleton className="w-24 h-8 rounded-lg" />
                        </div>
                        <Skeleton className="w-full h-64 rounded-xl" />
                    </div>

                    {/* Orders Skeleton */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <Skeleton className="w-48 h-6" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="mt-2"><SkeletonCircle size="w-4 h-4" /></div>
                                <div className="flex-1 p-4 border border-white/40 rounded-xl bg-white/40">
                                    <Skeleton className="w-32 h-3 mb-2" />
                                    <Skeleton className="w-48 h-5 mb-2" />
                                    <Skeleton className="w-full h-4" />
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-2"><SkeletonCircle size="w-4 h-4" /></div>
                                <div className="flex-1 p-4 border border-white/40 rounded-xl bg-white/40">
                                    <Skeleton className="w-32 h-3 mb-2" />
                                    <Skeleton className="w-48 h-5 mb-2" />
                                    <Skeleton className="w-full h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel Skeleton */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Quick Actions */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-6">
                        <Skeleton className="w-32 h-6 mb-4" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="col-span-2 h-14 rounded-md" />
                            <Skeleton className="h-20 rounded-md" />
                            <Skeleton className="h-20 rounded-md" />
                        </div>
                    </div>

                    {/* Weather Widget */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-200/50 h-48"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
