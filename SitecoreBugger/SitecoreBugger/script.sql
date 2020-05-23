USE [SC_BUGGER]
GO
/****** Object:  UserDefinedFunction [dbo].[FN_ListToTable]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[FN_ListToTable]
(
     @SplitOn              char(1)              --REQUIRED, the character to split the @List string on
    ,@List                 varchar(8000)        --REQUIRED, the list to split apart
)
RETURNS
@ParsedList table
(
    ListValue varchar(500)
)
AS
BEGIN

/**
Takes the given @List string and splits it apart based on the given @SplitOn character.
A table is returned, one row per split item, with a column name "ListValue".
This function workes for fixed or variable lenght items.
Empty and null items will not be included in the results set.


Returns a table, one row per item in the list, with a column name "ListValue"

EXAMPLE:
----------
SELECT * FROM dbo.FN_ListToTable(',','1,12,123,1234,54321,6,A,*,|||,,,,B')

    returns:
        ListValue  
        -----------
        1
        12
        123
        1234
        54321
        6
        A
        *
        |||
        B

        (10 row(s) affected)

**/



----------------
--SINGLE QUERY-- --this will not return empty rows
----------------
INSERT INTO @ParsedList
        (ListValue)
    SELECT
        ListValue
        FROM (SELECT
                  LTRIM(RTRIM(SUBSTRING(List2, number+1, CHARINDEX(@SplitOn, List2, number+1)-number - 1))) AS ListValue
                  FROM (
                           SELECT @SplitOn + @List + @SplitOn AS List2
                       ) AS dt
                      INNER JOIN Numbers n ON n.Number < LEN(dt.List2)
                  WHERE SUBSTRING(List2, number, 1) = @SplitOn
             ) dt2
        WHERE ListValue IS NOT NULL AND ListValue!=''



RETURN

END --Function FN_ListToTable
GO
/****** Object:  Table [dbo].[ArchievedError]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ArchievedError](
	[ErrorId] [int] NOT NULL,
	[ErrorTitle] [nvarchar](255) NOT NULL,
	[ErrorDetail] [nvarchar](max) NOT NULL,
	[Selector] [nvarchar](max) NULL,
	[Uri] [nvarchar](max) NULL,
	[DateRaised] [nvarchar](max) NOT NULL,
	[ErrorSeverityId] [int] NOT NULL,
	[ErrorTypeId] [int] NOT NULL,
	[ErrorStatusId] [int] NOT NULL,
	[OwnerUserId] [int] NOT NULL,
	[AssigneeUserId] [int] NOT NULL,
	[ProjectId] [int] NOT NULL,
	[ScreenShotId] [int] NULL,
	[DeviceDetails] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ErrorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ArchievedScreenShot]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ArchievedScreenShot](
	[ScreenShotId] [int] NOT NULL,
	[ScreenShot] [varbinary](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ScreenShotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Error]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Error](
	[ErrorId] [int] IDENTITY(1,1) NOT NULL,
	[ErrorTitle] [nvarchar](255) NOT NULL,
	[ErrorDetail] [nvarchar](max) NOT NULL,
	[Selector] [nvarchar](max) NULL,
	[Uri] [nvarchar](max) NULL,
	[DateRaised] [nvarchar](max) NOT NULL,
	[ErrorSeverityId] [int] NOT NULL,
	[ErrorTypeId] [int] NOT NULL,
	[ErrorStatusId] [int] NOT NULL,
	[OwnerUserId] [int] NOT NULL,
	[AssigneeUserId] [int] NOT NULL,
	[ProjectId] [int] NOT NULL,
	[ScreenShotId] [int] NULL,
	[DeviceDetails] [nvarchar](max) NULL,
	[SitecoreComponentDetails] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ErrorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorSeverity]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorSeverity](
	[EId] [int] IDENTITY(1,1) NOT NULL,
	[EValue] [nvarchar](255) NOT NULL,
	[EDisplayName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorStatus]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorStatus](
	[EId] [int] IDENTITY(1,1) NOT NULL,
	[EValue] [nvarchar](255) NOT NULL,
	[EDisplayName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorType]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorType](
	[EId] [int] IDENTITY(1,1) NOT NULL,
	[EValue] [nvarchar](255) NOT NULL,
	[EDisplayName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Numbers]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Numbers](
	[Number] [int] NOT NULL,
 CONSTRAINT [PK_Numbers] PRIMARY KEY CLUSTERED 
(
	[Number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[ProjectId] [int] IDENTITY(1,1) NOT NULL,
	[ProjectName] [varchar](255) NOT NULL,
	[IsbuggerActivated] [bit] NOT NULL,
	[Url] [varchar](255) NOT NULL,
	[IsArchieved] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[Roles] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ScreenShot]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ScreenShot](
	[ScreenShotId] [int] IDENTITY(1,1) NOT NULL,
	[ScreenShot] [varbinary](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ScreenShotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](255) NOT NULL,
	[RoleId] [int] NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[PasswordSalt] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([AssigneeUserId])
REFERENCES [dbo].[User] ([UserId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([AssigneeUserId])
REFERENCES [dbo].[User] ([UserId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([AssigneeUserId])
REFERENCES [dbo].[User] ([UserId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([AssigneeUserId])
REFERENCES [dbo].[User] ([UserId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorSeverityId])
REFERENCES [dbo].[ErrorSeverity] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorSeverityId])
REFERENCES [dbo].[ErrorSeverity] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorSeverityId])
REFERENCES [dbo].[ErrorSeverity] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorSeverityId])
REFERENCES [dbo].[ErrorSeverity] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorStatusId])
REFERENCES [dbo].[ErrorStatus] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorStatusId])
REFERENCES [dbo].[ErrorStatus] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorStatusId])
REFERENCES [dbo].[ErrorStatus] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorStatusId])
REFERENCES [dbo].[ErrorStatus] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorTypeId])
REFERENCES [dbo].[ErrorType] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorTypeId])
REFERENCES [dbo].[ErrorType] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorTypeId])
REFERENCES [dbo].[ErrorType] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorTypeId])
REFERENCES [dbo].[ErrorType] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([ProjectId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([ProjectId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([ProjectId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([ProjectId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ScreenShotId])
REFERENCES [dbo].[ScreenShot] ([ScreenShotId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ScreenShotId])
REFERENCES [dbo].[ScreenShot] ([ScreenShotId])
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Role] ([RoleId])
GO
/****** Object:  StoredProcedure [dbo].[SP_ActivateProject]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_ActivateProject]
@ProjectId int,
@ProjectName nvarchar(255),
@Url nvarchar(max),
@IsbuggerActivated bit,
@IsArchieved bit,
@Type nvarchar(255)
AS
BEGIN

	IF @Type IS NOT NULL
		BEGIN
			IF(@Type = 'add')
				BEGIN
				INSERT INTO [dbo].[Project]
						   ([ProjectName]
						   ,[IsbuggerActivated]
						   ,[Url]
						   ,[IsArchieved])
					 VALUES
						   (@ProjectName
						   ,@IsbuggerActivated
						   ,@Url
						   ,@IsArchieved);
				END
				ELSE
			IF(@Type = 'update')
				BEGIN
				UPDATE Project SET ProjectName = @ProjectName, [Url] = @Url, IsbuggerActivated = @IsbuggerActivated,
				IsArchieved = @IsArchieved WHERE ProjectId = @ProjectId;
				END
			IF(@Type = 'delete')
				BEGIN
				DELETE Project WHERE ProjectId = @ProjectId;
				END
		END

END



GO
/****** Object:  StoredProcedure [dbo].[SP_ArchieveProject]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


  CREATE PROCEDURE [dbo].[SP_ArchieveProject]
  @ProjectId int
  AS
  BEGIN

	INSERT INTO ArchievedError (
			[ErrorId],
			[ErrorTitle]
           ,[ErrorDetail]
           ,[Selector]
           ,[Uri]
           ,[DateRaised]
           ,[ErrorSeverityId]
           ,[ErrorTypeId]
           ,[ErrorStatusId]
           ,[OwnerUserId]
           ,[AssigneeUserId]
           ,[ProjectId]
           ,[ScreenShotId]
           ,[DeviceDetails])
	SELECT [ErrorId],
			[ErrorTitle]
           ,[ErrorDetail]
           ,[Selector]
           ,[Uri]
           ,[DateRaised]
           ,[ErrorSeverityId]
           ,[ErrorTypeId]
           ,[ErrorStatusId]
           ,[OwnerUserId]
           ,[AssigneeUserId]
           ,[ProjectId]
           ,[ScreenShotId]
           ,[DeviceDetails]
	FROM Error
	WHERE ProjectId = @ProjectId;

	DELETE FROM Error WHERE ProjectId = @ProjectId;

	INSERT INTO ArchievedScreenShot (ScreenShotId, ScreenShot) 
	SELECT ScreenShot.ScreenShotId, ScreenShot.ScreenShot FROM ScreenShot 
	INNER JOIN ArchievedError ON  ArchievedError.ScreenShotId = ScreenShot.ScreenShotId;

	DELETE FROM ScreenShot FROM ScreenShot INNER JOIN ArchievedScreenShot ON 
	ArchievedScreenShot.ScreenShotId = ScreenShot.ScreenShotId	

	UPDATE Project SET IsArchieved = 1, IsbuggerActivated = 0 WHERE ProjectId = @ProjectId;


  END

  --EXEC SP_ArchieveProject @ProjectId = 1

  --set identity_insert ArchievedScreenShot OFF
GO
/****** Object:  StoredProcedure [dbo].[SP_GetError]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






CREATE PROCEDURE [dbo].[SP_GetError]
@ErrorId int, 
@ProjectId int,
@AssigneeUserId int,
@ErrorSeverityId NVARCHAR(MAX),
@ErrorTypeId NVARCHAR(MAX),
@ErrorStatusId NVARCHAR(MAX),
@PageSize int,
@PageNumber int
AS
BEGIN

	DECLARE @DYNAMIC_WHERE_SQL NVARCHAR(MAX) = '';
	DECLARE @DYNAMIC_GROUP_SQL NVARCHAR(MAX) = '';
	DECLARE @DYNAMIC_PAGINATION_SQL NVARCHAR(MAX) = '';
	DECLARE @FINAL_SQL NVARCHAR(MAX) = '';
	DECLARE @ANY__SINGLE_FILTER_FOUND bit = 0;	
	DECLARE @ANY__GROUP_FILTER_FOUND bit = 0;	


	-- Project Id check
	IF @ProjectId IS NOT NULL
		BEGIN
			SET @ANY__SINGLE_FILTER_FOUND = 1;			
			SET @DYNAMIC_WHERE_SQL += ' ProjectId = '+ CAST(@ProjectId as varchar(255)) +' ';			
		END

	-- Error Id check
	IF @ErrorId IS NOT NULL
		BEGIN		
			SET @ANY__SINGLE_FILTER_FOUND = 1;				
			SET @DYNAMIC_WHERE_SQL += ' AND ErrorId = '+ CAST(@ErrorId as varchar(255)) +' ';
		END

	-- Assignee Id check
	IF @AssigneeUserId IS NOT NULL
		BEGIN		
			SET @ANY__SINGLE_FILTER_FOUND = 1;				
			SET @DYNAMIC_WHERE_SQL += ' AND AssigneeUserId = '+ CAST(@AssigneeUserId as varchar(255)) +' ';
		END

	-- Severity Id check
	IF (@ErrorSeverityId IS NOT NULL)
		BEGIN		
			SET @ANY__GROUP_FILTER_FOUND = 1;		
		
			SET @DYNAMIC_GROUP_SQL += ' INNER JOIN FN_ListToTable('','','''+CAST(@ErrorSeverityId as varchar(255))+''') sev ON  E.ErrorSeverityId = sev.ListValue '

		END

		-- Severity Id check
	IF (@ErrorTypeId IS NOT NULL)
		BEGIN		
			SET @ANY__GROUP_FILTER_FOUND = 1;		
		
			SET @DYNAMIC_GROUP_SQL += ' INNER JOIN FN_ListToTable('','','''+CAST(@ErrorTypeId as varchar(255))+''') type ON  E.ErrorTypeId = type.ListValue '

		END

		-- Severity Id check
	IF (@ErrorStatusId IS NOT NULL)
		BEGIN		
			SET @ANY__GROUP_FILTER_FOUND = 1;		
		
			SET @DYNAMIC_GROUP_SQL += ' INNER JOIN FN_ListToTable('','','''+CAST(@ErrorStatusId as varchar(255))+''') stat ON  E.ErrorStatusId = stat.ListValue '

		END

	-- Result execution	
	IF @ANY__SINGLE_FILTER_FOUND = 1
		BEGIN		
			SET @DYNAMIC_WHERE_SQL = 'WHERE' + @DYNAMIC_WHERE_SQL ;			
		END

	-- Pagination
	SET @PageSize = isnull(@PageSize, 100);
	SET @PageNumber = isnull(@PageNumber, 1);
	SET @DYNAMIC_PAGINATION_SQL = 'ORDER BY ErrorId OFFSET '+CAST((@PageSize * (@PageNumber - 1) ) as nvarchar(255))+
	' ROWS FETCH NEXT '+CAST(@PageSize as nvarchar(255))+' ROWS ONLY '
		
	SET @FINAL_SQL = 'SELECT E.ErrorId,E.ErrorTitle,E.ErrorDetail,E.Selector,E.Uri,E.DateRaised,E.ErrorSeverityId,E.ErrorTypeId,E.ErrorStatusId,E.OwnerUserId,E.AssigneeUserId,E.ProjectId,E.ScreenShotId,E.DeviceDetails,E.SitecoreComponentDetails FROM [Error] as E LEFT JOIN [ScreenShot] as S ON S.ScreenShotId = E.ScreenShotId OR E.ScreenShotId = NULL '+ @DYNAMIC_GROUP_SQL+ @DYNAMIC_WHERE_SQL + @DYNAMIC_PAGINATION_SQL;

	PRINT @FINAL_SQL;
	
	--EXEC(@FINAL_SQL);
	EXECUTE SP_EXECUTESQL @FINAL_SQL;
	
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetErrorId]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetErrorId]
@ProjectId int
AS
BEGIN
SELECT [ErrorId] FROM [SC_BUGGER].[dbo].[Error] WHERE ProjectId = @ProjectId
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetImageByErrorId]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetImageByErrorId]
@ErrorId int
AS
BEGIN
SELECT * FROM ScreenShot WHERE ScreenShotId =(SELECT ScreenShotId from Error WHERE ErrorId = @ErrorId)
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetMasterData]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





CREATE PROCEDURE [dbo].[SP_GetMasterData]
@UserId int
AS
BEGIN
	SELECT ProjectId,ProjectName,Url FROM Project WHERE IsbuggerActivated = 1;

	SELECT EId,EDisplayName FROM ErrorSeverity;
	SELECT EId,EDisplayName FROM ErrorStatus;
	SELECT EId,EDisplayName FROM ErrorType;
	SELECT * FROM [User];

	IF @UserId IS NOT NULL
		BEGIN
			SELECT * FROM [User] WHERE UserId = @UserId;			
		END
		ELSE
		BEGIN
			SELECT * FROM [User] WHERE 0 = 1;
		END
	
	SELECT RoleId as EId,Roles EDisplayName FROM Role;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProject]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetProject]
AS
BEGIN
SELECT * FROM [Project]
END 
GO
/****** Object:  StoredProcedure [dbo].[SP_GetUser]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_GetUser]
@Email nvarchar(255)
AS
BEGIN
SELECT * FROM [User] WHERE Email = @Email
END
GO
/****** Object:  StoredProcedure [dbo].[SP_RegisterUser]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  CREATE PROCEDURE [dbo].[SP_RegisterUser]
  @UserName nvarchar(255),
  @RoleId int,
  @PasswordHash nvarchar(255),
  @PasswordSalt nvarchar(255),
  @Email nvarchar(255)
  AS
  BEGIN
  -- Register User
	IF NOT EXISTS (SELECT UserId FROM [User] WHERE Email = @Email)
		BEGIN
		INSERT INTO [dbo].[User]
				   ([UserName]
				   ,[RoleId]
				   ,[PasswordHash]
				   ,[PasswordSalt]
				   ,[Email])
			 VALUES
				   (@UserName
				   ,@RoleId
				   ,@PasswordHash
				   ,@PasswordSalt
				   ,@Email)
		SELECT UserId, UserName , RoleId FROM [User] WHERE Email = @Email;

		END
	ELSE
	-- Already available User
		BEGIN
		SELECT UserId, UserName , RoleId FROM [User] WHERE 0 = 1;
		END
  END
GO
/****** Object:  StoredProcedure [dbo].[SP_SaveError]    Script Date: 8/25/2019 5:32:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_SaveError]
@ErrorId int,
@ErrorTitle nvarchar(255),
@ErrorDetail nvarchar(max),
@DeviceDetails nvarchar(max),
@Selector nvarchar(255),
@Uri nvarchar(255),
@ErrorSeverityId int,
@ErrorTypeId int,
@ErrorStatusId int,
@OwnerUserId int,
@AssigneeUserId int,
@ProjectId int,
@Screenshot varbinary(max),
@UpdateScreenshot bit,
@SitecoreComponentDetails nvarchar(max)
AS
BEGIN

DECLARE @TempScreen_shot_id int = NULL;

	IF @ErrorId IS NOT NULL
		BEGIN	

			SET @TempScreen_shot_id = (SELECT ScreenShotId FROM Error WHERE ErrorId = @ErrorId);

			-- Check update screen shot 
			IF @UpdateScreenshot = 1
			BEGIN			
				IF @TempScreen_shot_id IS NULL
				BEGIN
					-- Inser scrren shot and get id
					INSERT INTO ScreenShot (ScreenShot) VALUES (@Screenshot);
					SET @TempScreen_shot_id = SCOPE_IDENTITY();
				END
				ELSE
				BEGIN
					IF @Screenshot IS NULL
					BEGIN
						UPDATE Error SET ScreenshotId = NULL WHERE ErrorId = @ErrorId;
						DELETE ScreenShot WHERE ScreenshotId = @TempScreen_shot_id;
					END
					ELSE
					BEGIN
						-- Inser scrren shot and get id
						UPDATE ScreenShot SET ScreenShot = @Screenshot WHERE ScreenShotId = @TempScreen_shot_id;
					END
				END
			END

			UPDATE [Error]
			SET
				[ErrorTitle] = @ErrorTitle
			   ,[ErrorDetail] = @ErrorDetail			   	   			   
			   ,[ErrorSeverityId]= @ErrorSeverityId			   
			   ,[ErrorTypeId]= @ErrorTypeId
			   ,[ErrorStatusId]= @ErrorStatusId	
			   ,[AssigneeUserId] =@AssigneeUserId
			   WHERE ErrorId = @ErrorId

			   IF @Screenshot IS NOT NULL
			   BEGIN
				   UPDATE [Error]
					SET				
				   [ScreenShotId]= @TempScreen_shot_id			  
				   WHERE ErrorId = @ErrorId
			   END

		END
		ELSE
		BEGIN

			-- Check screen shot is null
			IF @Screenshot IS NOT NULL
			BEGIN	
				-- Inser scrren shot and get id
				INSERT INTO ScreenShot (ScreenShot) VALUES (@Screenshot);
				SET @TempScreen_shot_id = SCOPE_IDENTITY();
			END
		
			-- Insert error 
				INSERT INTO [Error]
				   ([ErrorTitle]
				   ,[ErrorDetail]
				   ,[Selector]
				   ,[Uri]
				   ,[DateRaised]
				   ,[ScreenShotId]
				   ,[ErrorSeverityId]
				   ,[ErrorTypeId]
				   ,[ErrorStatusId]
				   ,[OwnerUserId]
				   ,[AssigneeUserId]
				   ,[ProjectId]
				   ,[DeviceDetails]
				   ,[SitecoreComponentDetails])
			 VALUES
				   (@ErrorTitle
				   ,@ErrorDetail
				   ,@Selector
				   ,@Uri
				   ,GETDATE()
				   ,@TempScreen_shot_id
				   ,@ErrorSeverityId
				   ,@ErrorTypeId
				   ,@ErrorStatusId
				   ,@OwnerUserId
				   ,@AssigneeUserId
				   ,@ProjectId
				   ,@DeviceDetails
				   ,@SitecoreComponentDetails)
			END

SELECT @ErrorId AS ErrorId , 'true' AS IsSuccess

END
GO


SET IDENTITY_INSERT [dbo].[ErrorSeverity] ON 
INSERT [dbo].[ErrorSeverity] ([EId], [EValue], [EDisplayName]) VALUES (1, N'low', N'Low')
INSERT [dbo].[ErrorSeverity] ([EId], [EValue], [EDisplayName]) VALUES (2, N'medium', N'Medium')
INSERT [dbo].[ErrorSeverity] ([EId], [EValue], [EDisplayName]) VALUES (3, N'high', N'High')
INSERT [dbo].[ErrorSeverity] ([EId], [EValue], [EDisplayName]) VALUES (4, N'critical', N'Critical')
SET IDENTITY_INSERT [dbo].[ErrorSeverity] OFF

SET IDENTITY_INSERT [dbo].[ErrorStatus] ON 
INSERT [dbo].[ErrorStatus] ([EId], [EValue], [EDisplayName]) VALUES (1, N'open', N'Open')
INSERT [dbo].[ErrorStatus] ([EId], [EValue], [EDisplayName]) VALUES (2, N're-open', N'Re open')
INSERT [dbo].[ErrorStatus] ([EId], [EValue], [EDisplayName]) VALUES (3, N'closed', N'Closed')
INSERT [dbo].[ErrorStatus] ([EId], [EValue], [EDisplayName]) VALUES (5, N'ready-to-test', N'Ready to  re test')
INSERT [dbo].[ErrorStatus] ([EId], [EValue], [EDisplayName]) VALUES (6, N'na', N'Not applicable')
INSERT [dbo].[ErrorStatus] ([EId], [EValue], [EDisplayName]) VALUES (7, N'nr', N'Not reproduced')
SET IDENTITY_INSERT [dbo].[ErrorStatus] OFF

SET IDENTITY_INSERT [dbo].[ErrorType] ON 
INSERT [dbo].[ErrorType] ([EId], [EValue], [EDisplayName]) VALUES (1, N'functional', N'Functional')
INSERT [dbo].[ErrorType] ([EId], [EValue], [EDisplayName]) VALUES (2, N'design', N'Design')
INSERT [dbo].[ErrorType] ([EId], [EValue], [EDisplayName]) VALUES (3, N'environmental', N'Environmental')
INSERT [dbo].[ErrorType] ([EId], [EValue], [EDisplayName]) VALUES (4, N'requirement', N'Requirement')
INSERT [dbo].[ErrorType] ([EId], [EValue], [EDisplayName]) VALUES (5, N'others', N'Others')
SET IDENTITY_INSERT [dbo].[ErrorType] OFF

SET IDENTITY_INSERT [dbo].[Role] ON 
INSERT [dbo].[Role] ([RoleId], [Roles]) VALUES (1, N'Developer')
INSERT [dbo].[Role] ([RoleId], [Roles]) VALUES (2, N'Tester')
INSERT [dbo].[Role] ([RoleId], [Roles]) VALUES (3, N'Manger')
INSERT [dbo].[Role] ([RoleId], [Roles]) VALUES (4, N'Admin')
SET IDENTITY_INSERT [dbo].[Role] OFF

