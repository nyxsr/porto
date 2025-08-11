'use client';

import React from 'react';

import { COMPANIES, CompanyIds } from '@/constants/company';
import { useCompanyStore } from '@/store/company.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CompanySelector() {
  const value = useCompanyStore((state) => state.company);
  const setValue = useCompanyStore((state) => state.setCompany);

  return (
    <Select value={value} onValueChange={(value) => setValue(value as CompanyIds)}>
      <SelectTrigger className='w-max cursor-pointer border-none outline-none focus-visible:ring-0'>
        <SelectValue placeholder='Professional Journey' />
      </SelectTrigger>
      <SelectContent>
        {COMPANIES.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name} {company.current ? '(Current)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
