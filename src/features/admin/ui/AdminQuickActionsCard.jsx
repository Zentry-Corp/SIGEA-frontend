import React from 'react';
import { FiSettings } from 'react-icons/fi';
import {
  InfoCard,
  InfoTitle,
  QuickActionsGrid,
  ActionCard,
  ActionIcon,
  ActionTitle,
  ActionDescription,
} from './adminDashboard.styles';

export const AdminQuickActionsCard = ({ actions }) => {
  return (
    <InfoCard>
      <InfoTitle>
        <FiSettings />
        Administración del Sistema
      </InfoTitle>

      <QuickActionsGrid>
        {actions.map((action, index) => (
          <ActionCard key={index} onClick={action.onClick}>
            <ActionIcon>{action.icon}</ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActionsGrid>
    </InfoCard>
  );
};

