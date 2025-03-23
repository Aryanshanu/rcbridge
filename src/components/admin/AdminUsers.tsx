
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  RefreshCcw, 
  ArrowUpDown, 
  User, 
  Shield,
  UserCog,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { UserRole, UserProfile } from "@/types/user";
import { getAllUsers, updateUserRole, formatDate } from "@/utils/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminUsersProps {
  userRole: UserRole | null;
}

export const AdminUsers = ({ userRole }: AdminUsersProps) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof UserProfile>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof UserProfile) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      }));
    }
  };

  // Get initials for avatar
  const getInitials = (name?: string | null): string => {
    if (!name) return "U";
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get icon for role
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield size={16} className="text-red-500" />;
      case "developer":
        return <UserCog size={16} className="text-blue-500" />;
      case "maintainer":
        return <UserCheck size={16} className="text-green-500" />;
      default:
        return <User size={16} />;
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (sortField === "created_at" || sortField === "updated_at") {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";
    
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });

  // Filter users
  const filteredUsers = sortedUsers.filter(user => {
    const searchFields = [
      user.email,
      user.username,
      user.full_name,
      user.role,
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  if (userRole !== "admin") {
    return (
      <div className="p-8 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Only administrators can access user management features.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setSortField("created_at");
            setSortDirection("desc");
            fetchUsers();
          }}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          <span>Refresh</span>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableCaption>
              {filteredUsers.length} users found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {sortField === "email" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {sortField === "role" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Joined
                    {sortField === "created_at" && (
                      <ArrowUpDown size={14} className={`transition ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ""} alt={user.full_name || user.username || ""} />
                        <AvatarFallback>{getInitials(user.full_name || user.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name || user.username || "Unnamed User"}</div>
                        {user.username && user.full_name && (
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getRoleIcon(user.role)}
                      <Badge 
                        variant="outline"
                        className={`capitalize ${
                          user.role === "admin" 
                            ? "bg-red-50 text-red-700 border-red-200" 
                            : user.role === "developer"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="maintainer">Maintainer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
