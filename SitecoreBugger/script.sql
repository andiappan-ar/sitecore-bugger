USE [dummy]
GO
/****** Object:  UserDefinedFunction [dbo].[FN_ListToTable]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[Error]    Script Date: 8/10/2019 3:12:38 AM ******/
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
PRIMARY KEY CLUSTERED 
(
	[ErrorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorSeverity]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[ErrorStatus]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[ErrorType]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[Numbers]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[Project]    Script Date: 8/10/2019 3:12:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[ProjectId] [int] IDENTITY(1,1) NOT NULL,
	[ProjectName] [varchar](255) NOT NULL,
	[IsbuggerActivated] [bit] NOT NULL,
	[Url] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[ScreenShot]    Script Date: 8/10/2019 3:12:38 AM ******/
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
/****** Object:  Table [dbo].[User]    Script Date: 8/10/2019 3:12:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](255) NOT NULL,
	[RoleId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([AssigneeUserId])
REFERENCES [dbo].[User] ([UserId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorSeverityId])
REFERENCES [dbo].[ErrorSeverity] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorStatusId])
REFERENCES [dbo].[ErrorStatus] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ErrorTypeId])
REFERENCES [dbo].[ErrorType] ([EId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([ProjectId])
GO
ALTER TABLE [dbo].[Error]  WITH CHECK ADD FOREIGN KEY([ScreenShotId])
REFERENCES [dbo].[ScreenShot] ([ScreenShotId])
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Role] ([RoleId])
GO
/****** Object:  StoredProcedure [dbo].[SP_ActivateProject]    Script Date: 8/10/2019 3:12:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_ActivateProject]
@ActivateIds nvarchar(max)
AS
BEGIN
	DECLARE @ActivateSql nvarchar(max) = '';

	SET  @ActivateSql = 'UPDATE Project SET IsbuggerActivated = 1 WHERE ProjectId in (' + @ActivateIds + ')';
	--PRINT @ActivateSql;
	EXECUTE SP_EXECUTESQL @ActivateSql;

	SET  @ActivateSql = 'UPDATE Project SET IsbuggerActivated = 0 WHERE ProjectId not in (' + @ActivateIds + ')';
	--PRINT @ActivateSql;
	EXECUTE SP_EXECUTESQL @ActivateSql;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetError]    Script Date: 8/10/2019 3:12:38 AM ******/
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
		
	SET @FINAL_SQL = 'SELECT E.ErrorId,E.ErrorTitle,E.ErrorDetail,E.Selector,E.Uri,E.DateRaised,E.ErrorSeverityId,E.ErrorTypeId,E.ErrorStatusId,E.OwnerUserId,E.AssigneeUserId,E.ProjectId,E.ScreenShotId,E.DeviceDetails,S.ScreenShot FROM [Error] as E LEFT JOIN [ScreenShot] as S ON S.ScreenShotId = E.ScreenShotId OR E.ScreenShotId = NULL '+ @DYNAMIC_GROUP_SQL+ @DYNAMIC_WHERE_SQL + @DYNAMIC_PAGINATION_SQL;

	PRINT @FINAL_SQL;
	
	--EXEC(@FINAL_SQL);
	EXECUTE SP_EXECUTESQL @FINAL_SQL;
	
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetErrorId]    Script Date: 8/10/2019 3:12:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetErrorId]
@ProjectId int
AS
BEGIN
SELECT [ErrorId] FROM [dummy].[dbo].[Error] WHERE ProjectId = @ProjectId
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetMasterData]    Script Date: 8/10/2019 3:12:38 AM ******/
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
	SELECT * FROM [User] WHERE UserId = @UserId;

	  --SELECT U.UserId,U.UserName,R.RoleId FROM [User] U
	  --JOIN [Role] R ON U.RoleId = R.RoleId
	  --WHERE U.UserId = @UserId;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_SaveError]    Script Date: 8/10/2019 3:12:38 AM ******/
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
@UpdateScreenshot bit
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
				-- Inser scrren shot and get id
					UPDATE ScreenShot SET ScreenShot = @Screenshot WHERE ScreenShotId = @TempScreen_shot_id;
				END
			END

			UPDATE [Error]
			SET
				[ErrorTitle] = @ErrorTitle
			   ,[ErrorDetail] = @ErrorDetail			   	   			   
			   ,[ErrorSeverityId]= @ErrorSeverityId
			   ,[ScreenShotId]= @TempScreen_shot_id
			   ,[ErrorTypeId]= @ErrorTypeId
			   ,[ErrorStatusId]= @ErrorStatusId				   
			   WHERE ErrorId = @ErrorId
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
				   ,[DeviceDetails])
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
				   ,@DeviceDetails)
			END


--INSERT INTO [Error]
--           ([ErrorTitle]
--           ,[ErrorDetail]
--           ,[Selector]
--           ,[Uri]
--           ,[DateRaised]
--           ,[ScreenShotId]
--           ,[ErrorSeverityId]
--           ,[ErrorTypeId]
--           ,[ErrorStatusId]
--           ,[OwnerUserId]
--           ,[AssigneeUserId]
--           ,[ProjectId])
--     VALUES
--           ('Title' + CAST(RAND() as varchar(max))
--           ,CAST(RAND() as varchar(max)) +CAST(RAND() as varchar(max)) +CAST(RAND() as varchar(max)) +CAST(RAND() as varchar(max)) +'I am detail dec' + CAST(RAND() as varchar(max)) + 'sihd ohdioshdi hsidh fishdifsdishdfi sdilf sldfkljsdkjf ksdfk bskdjbf'
--           ,CAST(RAND() as varchar(max)) +CAST(RAND() as varchar(max))
--           ,'http://localhost'
--           ,2019-8-8
--           ,1
--           ,2
--           ,3
--           ,3
--           ,3
--           ,3
--           ,1)

SELECT @ErrorId AS ErrorId , 'true' AS IsSuccess

END
GO
