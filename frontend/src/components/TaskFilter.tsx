
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, CONTRIBUTORS } from "@/constants/mock-tasks";
import { Search } from "lucide-react";

export interface FilterState {
  category: string;
  contributor: string;
  minReward: number | "";
  maxReward: number | "";
  startDate: string;
  endDate: string;
}

interface TaskFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function TaskFilter({ filters, onFilterChange, onReset }: TaskFilterProps) {
  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-[#0A0B0F]/40 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-6 lg:p-8 w-full">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white">Filter Completed Tasks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contributor Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Contributor</label>
            <Select
              value={filters.contributor}
              onValueChange={(value) => handleChange("contributor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contributor" />
              </SelectTrigger>
              <SelectContent>
                {CONTRIBUTORS.map((contributor) => (
                  <SelectItem key={contributor} value={contributor}>{contributor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Reward */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Min Reward (XLM)</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minReward}
              onChange={(e) => handleChange("minReward", e.target.value ? Number(e.target.value) : "")}
            />
          </div>

          {/* Max Reward */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Max Reward (XLM)</label>
            <Input
              type="number"
              placeholder="1000"
              value={filters.maxReward}
              onChange={(e) => handleChange("maxReward", e.target.value ? Number(e.target.value) : "")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Completion Date From</label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Completion Date To</label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onReset} variant="outline">Reset Filters</Button>
        </div>
      </div>
    </div>
  );
}
