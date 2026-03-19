'use client';

import { 
  Building2, 
  Users, 
  MapPin, 
  FileText, 
  Shield, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface DataIconProps {
  type: 'entity' | 'data' | 'chart' | 'contact' | 'location' | 'status';
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

/**
 * DataIcon - Reusable Icon Component
 * 
 * Provides consistent iconography for government data analytics platform.
 * Supports different types of data visualization and entity representation.
 */
export default function DataIcon({
  type,
  variant = 'default',
  size = 'md',
  className = '',
  color = 'default'
}: DataIconProps) {
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const colorClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const getIcon = () => {
    switch (type) {
      case 'entity':
        switch (variant) {
          case 'department': return <Building2 className={sizeClasses[size]} />;
          case 'agency': return <Shield className={sizeClasses[size]} />;
          case 'office': return <FileText className={sizeClasses[size]} />;
          case 'bureau': return <Award className={sizeClasses[size]} />;
          case 'commission': return <Users className={sizeClasses[size]} />;
          case 'board': return <Users className={sizeClasses[size]} />;
          case 'authority': return <Shield className={sizeClasses[size]} />;
          case 'district': return <MapPin className={sizeClasses[size]} />;
          default: return <Building2 className={sizeClasses[size]} />;
        }
      
      case 'data':
        switch (variant) {
          case 'population': return <Users className={sizeClasses[size]} />;
          case 'business': return <Building2 className={sizeClasses[size]} />;
          case 'reviews': return <Star className={sizeClasses[size]} />;
          case 'licenses': return <Award className={sizeClasses[size]} />;
          default: return <FileText className={sizeClasses[size]} />;
        }
      
      case 'chart':
        switch (variant) {
          case 'bar': return <BarChart3 className={sizeClasses[size]} />;
          case 'pie': return <PieChart className={sizeClasses[size]} />;
          case 'trend': return <TrendingUp className={sizeClasses[size]} />;
          case 'activity': return <Activity className={sizeClasses[size]} />;
          default: return <BarChart3 className={sizeClasses[size]} />;
        }
      
      case 'contact':
        switch (variant) {
          case 'phone': return <Phone className={sizeClasses[size]} />;
          case 'email': return <Mail className={sizeClasses[size]} />;
          case 'website': return <Globe className={sizeClasses[size]} />;
          default: return <Phone className={sizeClasses[size]} />;
        }
      
      case 'location':
        return <MapPin className={sizeClasses[size]} />;
      
      case 'status':
        switch (variant) {
          case 'active': return <Star className={sizeClasses[size]} />;
          case 'inactive': return <Calendar className={sizeClasses[size]} />;
          default: return <Activity className={sizeClasses[size]} />;
        }
      
      default:
        return <FileText className={sizeClasses[size]} />;
    }
  };

  return (
    <span className={`data-icon ${colorClasses[color]} ${className}`}>
      {getIcon()}
    </span>
  );
}
